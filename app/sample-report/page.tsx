'use client';

import { useState, useEffect } from 'react';
import { CarrierBrief, CarrierListItem, InspectionWithViolations } from '@/lib/types';
import { MOCK_CARRIER_INSPECTIONS } from '@/lib/seed-inspections-mock';
import { getBasicData } from '@/lib/basic-data-adapter';
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
  const [inspections, setInspections] = useState<InspectionWithViolations[]>([]);
  const [inspectionPercentile, setInspectionPercentile] = useState<number | undefined>();
  const [inspectionsLoading, setInspectionsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState<PlatformPage>('dashboard');
  const [activeNav, setActiveNav] = useState<NavSection>('home');

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

  // ── Inspections ──
  useEffect(() => {
    if (!data) { setInspections([]); return; }
    const usdot = data.usdot;

    if (data.source !== 'public-live') {
      const mockData = MOCK_CARRIER_INSPECTIONS[usdot];
      setInspections(mockData ?? []);
      setInspectionPercentile(undefined);
      return;
    }

    async function fetchInspections() {
      setInspectionsLoading(true);
      try {
        const response = await fetch(`/api/carriers/${usdot}/inspections`);
        const result = await response.json();
        if (result.data) {
          setInspections(result.data.inspectionDetails || []);
          setInspectionPercentile(result.data.basicPercentile);
        }
      } catch { /* non-fatal */ }
      finally { setInspectionsLoading(false); }
    }
    fetchInspections();
  }, [data]);

  // ── Nav sync ──
  function handleNavChange(nav: NavSection) {
    setActiveNav(nav);
    if (nav === 'home') setCurrentPage('dashboard');
    else if (nav === 'inspections') setCurrentPage('inspections');
    else if (nav === 'ai') setCurrentPage('ai-chat');
  }

  function handleNavigate(page: PlatformPage) {
    setCurrentPage(page);
    // Keep nav highlight in sync for top-level pages
    if (page === 'dashboard') setActiveNav('home');
    else if (page === 'inspections') setActiveNav('inspections');
    else if (page === 'ai-chat') setActiveNav('ai');
    else setActiveNav('home'); // BASIC pages are sub-pages of home
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
    const carrier = data;

    if (currentPage === 'dashboard') {
      return <HomePage data={carrier} onNavigate={handleNavigate} />;
    }

    if (currentPage === 'inspections') {
      return <InspectionsPage inspections={inspections} basicPercentile={inspectionPercentile} />;
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
      const basicData = getBasicData(currentPage, carrier, inspections);
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
      {/* Left navigation */}
      <LeftNav
        activeNav={activeNav}
        onNavChange={handleNavChange}
        carrierList={carrierList}
        selectedUsdot={selectedUsdot}
        onCarrierChange={(usdot) => { setSelectedUsdot(usdot); setCurrentPage('dashboard'); setActiveNav('home'); }}
        carrierName={data.carrierName}
      />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        {renderContent()}
      </main>

      {/* Mobile bottom nav */}
      <MobileBottomNav activeNav={activeNav} onNavChange={handleNavChange} />
    </div>
  );
}
