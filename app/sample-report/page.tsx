'use client';

import { useState, useEffect } from 'react';
import { CarrierBrief, CarrierListItem } from '@/lib/types';
import { getBasicData } from '@/lib/basic-data-adapter';
import { useCarrierInspections } from '@/hooks/useCarrierInspections';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { ErrorState } from '@/components/empty-state';

// Platform components
import { LeftNav, MobileBottomNav, NavSection } from '@/components/platform/left-nav';
import { HomePage, type PlatformPage } from '@/components/platform/home-page';
import { InspectionsPage } from '@/components/platform/inspections-page';
import { AiChatPage } from '@/components/platform/ai-chat-page';

// BASIC pages
import { UnsafeDrivingPage } from '@/components/platform/basics/unsafe-driving';
import { HOSCompliancePage } from '@/components/platform/basics/hos-compliance';
import { VehicleMaintenancePage } from '@/components/platform/basics/vehicle-maintenance';
import { DriverFitnessPage } from '@/components/platform/basics/driver-fitness';
import { ControlledSubstancesPage } from '@/components/platform/basics/controlled-substances';
import { CrashIndicatorPage } from '@/components/platform/basics/crash-indicator';
import { HazardousMaterialsPage } from '@/components/platform/basics/hazardous-materials';
import { SafetyManagementPage } from '@/components/platform/basics/safety-management';

export default function PlatformPage() {
  const [carrierList, setCarrierList] = useState<CarrierListItem[]>([]);
  const [selectedUsdot, setSelectedUsdot] = useState<string>('');
  const [data, setData] = useState<CarrierBrief | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<PlatformPage>('dashboard');
  const [activeNav, setActiveNav] = useState<NavSection>('home');

  // Single source of truth for all inspection-derived counts (P0.1)
  const inspectionData = useCarrierInspections(selectedUsdot);

  // ── Carrier list ──
  useEffect(() => {
    async function fetchCarrierList() {
      try {
        const response = await fetch('/api/carriers');
        const result = await response.json();
        if (result.data && result.data.length > 0) {
          setCarrierList(result.data);
          setSelectedUsdot(result.data[0].usdot);
        }
      } catch {
        setError('Failed to load carrier list');
      }
    }
    fetchCarrierList();
  }, []);

  // ── Carrier data ──
  useEffect(() => {
    if (!selectedUsdot) return;
    async function fetchCarrier() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/carriers/${selectedUsdot}`);
        const result = await response.json();
        if (result.error) {
          setError(result.error);
          setData(null);
        } else {
          setData(result.data);
        }
      } catch {
        setError('Failed to load carrier data');
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchCarrier();
  }, [selectedUsdot]);

  // ── Nav sync ──
  function handleNavChange(nav: NavSection) {
    setActiveNav(nav);
    if (nav === 'home')        setCurrentPage('dashboard');
    else if (nav === 'inspections') setCurrentPage('inspections');
    else if (nav === 'ai')     setCurrentPage('ai-chat');
  }

  function handleNavigate(page: PlatformPage) {
    setCurrentPage(page);
    if (page === 'dashboard')     setActiveNav('home');
    else if (page === 'inspections') setActiveNav('inspections');
    else if (page === 'ai-chat')  setActiveNav('ai');
    else                          setActiveNav('home'); // BASIC pages are sub-pages of home
  }

  function handleCarrierChange(usdot: string) {
    setSelectedUsdot(usdot);
    setCurrentPage('dashboard');
    setActiveNav('home');
  }

  // ── Loading / Error states ──
  if (loading && !data) {
    return (
      <div className="min-h-screen bg-ax-surface-secondary flex items-center justify-center">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-ax-surface-secondary">
        <ErrorState
          title="Failed to Load Platform"
          description={error}
          onRetry={() => { setLoading(true); setError(null); }}
        />
      </div>
    );
  }

  if (!data) return null;

  // ── BASIC page router ──
  function renderContent() {
    if (!data) return null;
    const carrier = data; // explicit assignment so TypeScript can narrow the type

    if (currentPage === 'dashboard') {
      return (
        <HomePage
          data={carrier}
          onNavigate={handleNavigate}
          inspectionData={inspectionData}
        />
      );
    }

    if (currentPage === 'inspections') {
      return (
        <InspectionsPage
          inspections={inspectionData.rows}
          kpis={inspectionData.kpis}
        />
      );
    }

    if (currentPage === 'ai-chat') {
      return <AiChatPage carrier={carrier} />;
    }

    // BASIC detail pages
    const BASIC_PAGES: PlatformPage[] = [
      'unsafe-driving', 'hos-compliance', 'vehicle-maintenance',
      'driver-fitness', 'controlled-substances', 'crash-indicator',
      'hazardous-materials', 'safety-management',
    ];

    if (BASIC_PAGES.includes(currentPage)) {
      // RichInspection is a superset of InspectionWithViolations for getBasicData's needs
      const basicData = getBasicData(currentPage, carrier, inspectionData.rows as unknown as Parameters<typeof getBasicData>[2]);
      const onBack = () => handleNavigate('dashboard');

      switch (currentPage) {
        case 'unsafe-driving':
          return <UnsafeDrivingPage basicData={basicData} carrier={carrier} onBack={onBack} />;
        case 'hos-compliance':
          return <HOSCompliancePage onBack={onBack} />;
        case 'vehicle-maintenance':
          return <VehicleMaintenancePage basicData={basicData} carrier={carrier} onBack={onBack} />;
        case 'driver-fitness':
          return <DriverFitnessPage basicData={basicData} carrier={carrier} onBack={onBack} />;
        case 'controlled-substances':
          return <ControlledSubstancesPage basicData={basicData} carrier={carrier} onBack={onBack} />;
        case 'crash-indicator':
          return <CrashIndicatorPage basicData={basicData} carrier={carrier} onBack={onBack} />;
        case 'hazardous-materials':
          return <HazardousMaterialsPage basicData={basicData} carrier={carrier} onBack={onBack} />;
        case 'safety-management':
          return <SafetyManagementPage basicData={basicData} carrier={carrier} onBack={onBack} />;
        default:
          return null;
      }
    }

    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-ax-surface-secondary font-sans">
      {/* Left navigation — inspection count flows from the single hook (P0.1) */}
      <LeftNav
        activeNav={activeNav}
        onNavChange={handleNavChange}
        carrierList={carrierList}
        selectedUsdot={selectedUsdot}
        onCarrierChange={handleCarrierChange}
        carrierName={data.carrierName}
        inspectionCount={inspectionData.totalCount}
      />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        {renderContent()}
      </main>

      {/* Mobile bottom nav — same count from hook (P0.1) */}
      <MobileBottomNav
        activeNav={activeNav}
        onNavChange={handleNavChange}
        inspectionCount={inspectionData.totalCount}
      />
    </div>
  );
}
