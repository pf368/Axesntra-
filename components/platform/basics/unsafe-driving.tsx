'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Minus,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Search,
  Filter,
  Activity,
  MapPin,
  Plus,
  X,
  Mail,
  Phone,
  User,
  Calendar,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { BasicPageData } from '@/lib/basic-data-adapter';
import type { CarrierBrief } from '@/lib/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Driver {
  initials: string;
  name: string;
  driverId: string;
  inspections: number;
  violations: number;
  mostRecent: string;
  topIssue: string;
  risk: string;
  status: string;
  email: string;
  phone: string;
  region: string;
  manager: string;
  violationTrend: { month: string; count: number }[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const trendData = [
  { month: 'Apr 25', violations: 5, percentile: 38 },
  { month: 'May 25', violations: 7, percentile: 41 },
  { month: 'Jun 25', violations: 4, percentile: 36 },
  { month: 'Jul 25', violations: 9, percentile: 47 },
  { month: 'Aug 25', violations: 6, percentile: 43 },
  { month: 'Sep 25', violations: 8, percentile: 45 },
  { month: 'Oct 25', violations: 5, percentile: 40 },
  { month: 'Nov 25', violations: 10, percentile: 48 },
  { month: 'Dec 25', violations: 7, percentile: 44 },
  { month: 'Jan 26', violations: 8, percentile: 46 },
  { month: 'Feb 26', violations: 6, percentile: 42 },
  { month: 'Mar 26', violations: 5, percentile: 39 },
];

const violationBreakdown = [
  { category: 'Speeding', count: 7, percentage: 39, trend: 'up' },
  { category: 'Following Too Closely', count: 5, percentage: 28, trend: 'up' },
  { category: 'Improper Lane Change', count: 3, percentage: 17, trend: 'stable' },
  { category: 'Reckless Driving', count: 2, percentage: 11, trend: 'down' },
  { category: 'Traffic Control', count: 1, percentage: 5, trend: 'stable' },
];

const driverRisk: Driver[] = [
  {
    initials: 'MR',
    name: 'Michael Rodriguez',
    driverId: 'DR-1847',
    inspections: 4,
    violations: 6,
    mostRecent: '2026-03-15',
    topIssue: 'Speeding',
    risk: 'high',
    status: 'Pending Review',
    email: 'michael.rodriguez@acmetransport.com',
    phone: '+1 (555) 412-7831',
    region: 'IL-Central Region',
    manager: 'James Chen',
    violationTrend: [
      { month: 'Jul', count: 0 },
      { month: 'Aug', count: 1 },
      { month: 'Sep', count: 2 },
      { month: 'Oct', count: 1 },
      { month: 'Nov', count: 2 },
      { month: 'Dec', count: 1 },
    ],
  },
  {
    initials: 'SJ',
    name: 'Sarah Johnson',
    driverId: 'DR-2252',
    inspections: 3,
    violations: 5,
    mostRecent: '2026-03-28',
    topIssue: 'Following Too Closely',
    risk: 'high',
    status: 'Pending Review',
    email: 'sarah.johnson@acmetransport.com',
    phone: '+1 (555) 233-3110',
    region: 'IL-Central Region',
    manager: 'Sarah Chen',
    violationTrend: [
      { month: 'Jul', count: 0 },
      { month: 'Aug', count: 1 },
      { month: 'Sep', count: 2 },
      { month: 'Oct', count: 1 },
      { month: 'Nov', count: 2 },
      { month: 'Dec', count: 1 },
    ],
  },
  {
    initials: 'JW',
    name: 'James Wilson',
    driverId: 'DR-3091',
    inspections: 2,
    violations: 3,
    mostRecent: '2026-02-10',
    topIssue: 'Improper Lane Change',
    risk: 'medium',
    status: 'Reviewed',
    email: 'james.wilson@acmetransport.com',
    phone: '+1 (555) 874-2201',
    region: 'IN-North Region',
    manager: 'David Park',
    violationTrend: [
      { month: 'Jul', count: 0 },
      { month: 'Aug', count: 0 },
      { month: 'Sep', count: 1 },
      { month: 'Oct', count: 1 },
      { month: 'Nov', count: 0 },
      { month: 'Dec', count: 1 },
    ],
  },
  {
    initials: 'EC',
    name: 'Emily Chen',
    driverId: 'DR-4413',
    inspections: 1,
    violations: 2,
    mostRecent: '2026-01-22',
    topIssue: 'Speeding',
    risk: 'medium',
    status: 'Reviewed',
    email: 'emily.chen@acmetransport.com',
    phone: '+1 (555) 661-9045',
    region: 'WI-South Region',
    manager: 'James Chen',
    violationTrend: [
      { month: 'Jul', count: 0 },
      { month: 'Aug', count: 1 },
      { month: 'Sep', count: 0 },
      { month: 'Oct', count: 0 },
      { month: 'Nov', count: 1 },
      { month: 'Dec', count: 0 },
    ],
  },
  {
    initials: 'DM',
    name: 'David Martinez',
    driverId: 'DR-5582',
    inspections: 1,
    violations: 1,
    mostRecent: '2025-12-18',
    topIssue: 'Traffic Control',
    risk: 'low',
    status: 'Reviewed',
    email: 'david.martinez@acmetransport.com',
    phone: '+1 (555) 309-7764',
    region: 'IL-South Region',
    manager: 'Sarah Chen',
    violationTrend: [
      { month: 'Jul', count: 0 },
      { month: 'Aug', count: 0 },
      { month: 'Sep', count: 0 },
      { month: 'Oct', count: 1 },
      { month: 'Nov', count: 0 },
      { month: 'Dec', count: 0 },
    ],
  },
  {
    initials: 'LA',
    name: 'Lisa Anderson',
    driverId: 'DR-6774',
    inspections: 1,
    violations: 1,
    mostRecent: '2025-11-30',
    topIssue: 'Speeding',
    risk: 'low',
    status: 'Reviewed',
    email: 'lisa.anderson@acmetransport.com',
    phone: '+1 (555) 502-1388',
    region: 'IL-Central Region',
    manager: 'David Park',
    violationTrend: [
      { month: 'Jul', count: 0 },
      { month: 'Aug', count: 0 },
      { month: 'Sep', count: 1 },
      { month: 'Oct', count: 0 },
      { month: 'Nov', count: 0 },
      { month: 'Dec', count: 0 },
    ],
  },
];

const inspectionHistory = [
  { date: '2026-03-28', location: 'IL-159', driver: 'Sarah Johnson', violationType: 'Following Too Closely', severity: 'Medium', oos: false, status: 'Pending' },
  { date: '2026-03-15', location: 'IL-880', driver: 'Michael Rodriguez', violationType: 'Speeding 15+ MPH', severity: 'High', oos: true, status: 'Pending' },
  { date: '2026-03-07', location: 'IL-157', driver: 'Michael Rodriguez', violationType: 'Speeding', severity: 'Medium', oos: false, status: 'Pending' },
  { date: '2026-02-20', location: 'IN-165', driver: 'Sarah Johnson', violationType: 'Following Too Closely', severity: 'Low', oos: false, status: 'Reviewed' },
  { date: '2026-02-10', location: 'IL-138', driver: 'James Wilson', violationType: 'Improper Lane Change', severity: 'Medium', oos: false, status: 'Reviewed' },
  { date: '2026-01-22', location: 'WI-94', driver: 'Emily Chen', violationType: 'Speeding', severity: 'Medium', oos: false, status: 'Reviewed' },
];

const smartAlerts = [
  { id: 1, title: 'Speeding Pattern Detected', description: '5 speeding violations in IL-Central region within 30 days', severity: 'critical', date: '2 days ago' },
  { id: 2, title: 'Driver Recurrence Flagged', description: 'Michael Rodriguez has 4 unsafe driving events in Q4', severity: 'high', date: '5 days ago' },
  { id: 3, title: 'Geographic Cluster Identified', description: '67% of violations concentrated in single corridor', severity: 'high', date: '1 week ago' },
  { id: 4, title: 'Trend Analysis', description: 'Following too closely violations up 40% vs baseline', severity: 'medium', date: '3 weeks ago' },
];

const actionItems = [
  { title: '7 drivers need coaching', priority: 'high', count: 2 },
  { title: '3 inspections pending review', priority: 'medium', count: 1 },
  { title: '1 pattern requiring attention', priority: 'low', count: 3 },
];

// ─── Animation variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

// ─── RiskBadge ────────────────────────────────────────────────────────────────

const RiskBadge = ({ risk }: { risk: string }) => {
  const config: Record<string, string> = {
    high: 'bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]',
    medium: 'bg-[#fff7ed] text-[#c2410c] border border-[#fed7aa]',
    low: 'bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0]',
  };
  const label: Record<string, string> = { high: 'High Risk', medium: 'Medium Risk', low: 'Low Risk' };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${config[risk] ?? config.low}`}>
      {label[risk] ?? risk}
    </span>
  );
};

// ─── Alert helpers ────────────────────────────────────────────────────────────

const AlertSeverityDot = ({ severity }: { severity: string }) => {
  const colors: Record<string, string> = {
    critical: 'bg-[#ef4444]',
    high: 'bg-[#f97316]',
    medium: 'bg-[#f59e0b]',
    low: 'bg-[#94a3b8]',
  };
  return <div className={`w-2 h-2 rounded-full shrink-0 mt-1 ${colors[severity] ?? colors.low}`} />;
};

// ─── Driver Detail Panel ──────────────────────────────────────────────────────

function DriverDetailPanel({ driver, onClose }: { driver: Driver; onClose: () => void }) {
  const avatarGradients: Record<string, string> = {
    MR: 'from-[#ef4444] to-[#dc2626]',
    SJ: 'from-[#2b7fff] to-[#4f39f6]',
    JW: 'from-[#f97316] to-[#ea580c]',
    EC: 'from-[#8b5cf6] to-[#7c3aed]',
    DM: 'from-[#10b981] to-[#059669]',
    LA: 'from-[#06b6d4] to-[#0891b2]',
  };
  const gradient = avatarGradients[driver.initials] ?? 'from-[#3b82f6] to-[#2563eb]';

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/25 z-[60]"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        key="driver-panel"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 340, damping: 32 }}
        className="fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl z-[70] flex flex-col"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        {/* Scrollable area */}
        <div className="flex-1 overflow-y-auto">
          {/* Top: Avatar + Name + Close */}
          <div className="px-6 pt-7 pb-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}
                >
                  <span className="text-white text-[20px] font-bold">{driver.initials}</span>
                </div>
                <div>
                  <h2 className="text-[22px] font-semibold text-[#0f172b] leading-tight">
                    {driver.name}
                  </h2>
                  <p className="text-sm text-[#45556c] mt-0.5">Driver ID: {driver.driverId}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-[#f1f5f9] transition-colors text-[#62748e] hover:text-[#0f172b] mt-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status tags */}
            <div className="flex items-center gap-2">
              <RiskBadge risk={driver.risk} />
              <span className="flex items-center gap-1.5 text-xs font-medium text-[#c2410c] bg-[#fff7ed] border border-[#fed7aa] px-2 py-0.5 rounded">
                <Clock className="w-3 h-3" />
                {driver.status}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#f1f5f9] mx-6" />

          {/* KPI row */}
          <div className="px-6 py-5 grid grid-cols-3 gap-3">
            {[
              { label: 'INSPECTIONS', value: String(driver.inspections), mono: false },
              { label: 'VIOLATIONS', value: String(driver.violations), mono: false },
              { label: 'LAST EVENT', value: driver.mostRecent, mono: true },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-[#f8fafc] rounded-xl p-3 border border-[#f1f5f9]">
                <div className="text-[10px] font-semibold text-[#62748e] uppercase tracking-wider mb-1.5">
                  {kpi.label}
                </div>
                <div
                  className="font-bold text-[#0f172b]"
                  style={
                    kpi.mono
                      ? { fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 600 }
                      : { fontSize: 24 }
                  }
                >
                  {kpi.value}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Information */}
          <div className="mx-6 mb-5 rounded-xl border border-[#e5e7eb] p-4">
            <h3 className="text-sm font-semibold text-[#0f172b] mb-3">Contact Information</h3>
            <div className="space-y-2.5">
              {[
                { Icon: Mail, text: driver.email },
                { Icon: Phone, text: driver.phone },
                { Icon: MapPin, text: driver.region },
                { Icon: User, text: `Assigned Manager: ${driver.manager}` },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-[#62748e] shrink-0" />
                  <span className="text-sm text-[#314158]">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Violation Trend */}
          <div className="mx-6 mb-6">
            <h3 className="text-sm font-semibold text-[#0f172b] mb-3">
              Violation Trend (Last 6 Months)
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart
                data={driver.violationTrend}
                margin={{ top: 4, right: 4, bottom: 0, left: -28 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  domain={[0, 'auto']}
                />
                <Tooltip
                  contentStyle={{ border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#0f172b', fontWeight: 600 }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#ef4444' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sticky footer action buttons */}
        <div className="px-6 pt-4 pb-6 border-t border-[#f1f5f9] bg-white space-y-2.5">
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#155dfc] text-white rounded-xl text-sm font-medium hover:bg-[#1249cc] transition-colors">
              <Calendar className="w-4 h-4" />
              Schedule Coaching
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#e5e7eb] rounded-xl text-sm font-medium text-[#314158] hover:bg-[#f8fafc] transition-colors">
              Add Note
            </button>
          </div>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#e5e7eb] rounded-xl text-sm font-medium text-[#314158] hover:bg-[#f8fafc] transition-colors">
            View Full Driver Profile
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  basicData: BasicPageData;
  carrier: CarrierBrief;
  onBack: () => void;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function UnsafeDrivingPage({ onBack }: Props) {
  const [timeRange, setTimeRange] = useState('6M');
  const [driverSearch, setDriverSearch] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const filteredDrivers = driverRisk.filter((d) =>
    d.name.toLowerCase().includes(driverSearch.toLowerCase())
  );

  const handleDriverClick = (driver: Driver) => {
    setSelectedDriver((prev) => (prev?.driverId === driver.driverId ? null : driver));
  };

  return (
    <div className="min-h-screen bg-[#f9fafb]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* Driver Detail Overlay */}
      <AnimatePresence>
        {selectedDriver && (
          <DriverDetailPanel
            key={selectedDriver.driverId}
            driver={selectedDriver}
            onClose={() => setSelectedDriver(null)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-[#e2e8f0] sticky top-0 z-50"
      >
        <div className="max-w-[1600px] mx-auto px-8 py-5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#62748e] mb-4">
            <button onClick={onBack} className="hover:text-[#0f172b] transition-colors">
              Dashboard
            </button>
            <ChevronRight className="w-4 h-4" />
            <span>BASIC Detail</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0f172b] font-medium">Unsafe Driving</span>
          </div>

          {/* Title + Actions */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[30px] font-semibold text-[#0f172b] mb-3">Unsafe Driving</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="px-4 py-1.5 bg-[#d0fae5] text-[#006045] text-sm font-medium rounded-full">
                  Within Threshold
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[24px] font-bold text-[#0f172b]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    45.0
                  </span>
                  <span className="text-sm text-[#45556c]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    percentile
                  </span>
                </div>
                <div className="w-px h-6 bg-[#cad5e2]" />
                <div className="text-sm text-[#45556c]">
                  Threshold: <span className="text-[#0f172b] font-semibold">65.0</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#009966]">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-sm font-medium">-3.2% vs 30D</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-[#cad5e2] rounded-[10px] text-sm font-medium text-[#314158] hover:bg-[#f8fafc] transition-colors">
                <FileText className="w-4 h-4" />
                View All Inspections
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 border border-[#cad5e2] rounded-[10px] text-sm font-medium text-[#314158] hover:bg-[#f8fafc] transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#155dfc] text-white rounded-[10px] text-sm font-medium hover:bg-[#1249cc] transition-colors">
                <Plus className="w-4 h-4" />
                Create Action Plan
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Body */}
      <div className="max-w-[1600px] mx-auto px-8 py-7">
        <div className="flex gap-6">
          {/* Main Column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 min-w-0 space-y-6"
          >
            {/* AI Safety Analysis */}
            <motion.div
              variants={itemVariants}
              className="rounded-[14px] border border-[#dbeafe] p-8"
              style={{ background: 'linear-gradient(148deg, #eff6ff 0%, #eef2ff 100%)' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#155dfc] rounded-[10px] flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-[20px] font-semibold text-[#0f172b]">AI Safety Analysis</h2>
              </div>
              <div className="grid grid-cols-2 gap-x-10 gap-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1 h-4 bg-[#155dfc] rounded-full" />
                    <span className="text-xs font-semibold text-[#1c398e] uppercase tracking-wide">What This BASIC Measures</span>
                  </div>
                  <p className="text-[15px] text-[#314158] leading-relaxed">
                    The Unsafe Driving BASIC tracks violations related to dangerous driving behaviors including speeding, reckless operation, improper lane changes, following too closely, and violations of traffic control devices. Higher percentiles indicate elevated risk.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1 h-4 bg-[#155dfc] rounded-full" />
                    <span className="text-xs font-semibold text-[#1c398e] uppercase tracking-wide">Why This Score Matters</span>
                  </div>
                  <p className="text-[15px] text-[#314158] leading-relaxed">
                    ACME Transport&apos;s 45.0 percentile is well within the safe threshold but requires monitoring. A sustained upward trend could trigger intervention thresholds and increase CSA enforcement attention, potentially affecting insurance rates and operational authority.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1 h-4 bg-[#ff6900] rounded-full" />
                    <span className="text-xs font-semibold text-[#1c398e] uppercase tracking-wide">Root Causes Detected</span>
                  </div>
                  <ul className="space-y-2">
                    {[
                      '3 speeding violations concentrated in Q3 2024 (IL-Central region)',
                      '2 drivers account for 67% of unsafe driving events',
                      'Following too closely violations increased 40% vs prior period',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[15px] text-[#314158] leading-relaxed">
                        <span className="text-[#ff6900] mt-0.5 shrink-0">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1 h-4 bg-[#00bc7d] rounded-full" />
                    <span className="text-xs font-semibold text-[#1c398e] uppercase tracking-wide">Recommended Prevention Steps</span>
                  </div>
                  <ol className="space-y-2">
                    {[
                      'Schedule coaching sessions for top 2 high-risk drivers',
                      'Implement speed monitoring on IL-Central routes',
                      'Review and reinforce defensive driving protocols in safety meetings',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[15px] text-[#314158] leading-relaxed">
                        <span className="text-[#009966] font-semibold shrink-0">{i + 1}.</span>
                        {item}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </motion.div>

            {/* KPI Row */}
            <motion.div variants={itemVariants} className="grid grid-cols-6 gap-4">
              {[
                { label: 'Percentile', value: '45.0', sub: '↓ -3.2%', subColor: 'text-[#009966]', mono: true },
                { label: 'Threshold (I)', value: '65.0', sub: 'FMCSA limit', subColor: 'text-[#62748e]', mono: true },
                { label: '30D Trend', value: '-5.8%', sub: 'Improving', subColor: 'text-[#009966]', mono: true },
                { label: 'Inspections', value: '12', sub: 'last 30 days', subColor: 'text-[#62748e]', mono: false },
                { label: 'Violations', value: '18', sub: 'cited total', subColor: 'text-[#62748e]', mono: false },
                { label: 'Drivers Involved', value: '8', sub: 'unique drivers', subColor: 'text-[#62748e]', mono: false },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-white border border-[#e5e7eb] rounded-lg p-4">
                  <div className="text-xs font-medium text-[#62748e] uppercase tracking-wide mb-2">
                    {kpi.label}
                  </div>
                  <div
                    className="text-[24px] font-bold text-[#0f172b] mb-1"
                    style={kpi.mono ? { fontFamily: 'JetBrains Mono, monospace' } : {}}
                  >
                    {kpi.value}
                  </div>
                  <div className={`text-xs font-medium ${kpi.subColor}`}>{kpi.sub}</div>
                </div>
              ))}
            </motion.div>

            {/* Charts Row */}
            <div className="grid grid-cols-2 gap-6">
              <motion.div variants={itemVariants} className="bg-white border border-[#e5e7eb] rounded-lg p-6">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-semibold text-[#0f172b]">Unsafe Driving Trend</h3>
                  <div className="flex gap-1">
                    {['90D', '6M', '12M'].map((r) => (
                      <button
                        key={r}
                        onClick={() => setTimeRange(r)}
                        className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                          timeRange === r ? 'bg-[#155dfc] text-white' : 'text-[#62748e] hover:bg-[#f1f5f9]'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#62748e] mb-4">Monthly violations over time</p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={trendData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }} />
                    <Line type="monotone" dataKey="violations" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#3b82f6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white border border-[#e5e7eb] rounded-lg p-6">
                <h3 className="text-base font-semibold text-[#0f172b] mb-1">Violation Breakdown</h3>
                <p className="text-xs text-[#62748e] mb-5">Top violation categories</p>
                <div className="space-y-3">
                  {violationBreakdown.map((v) => {
                    const TrendIcon = v.trend === 'up' ? TrendingUp : v.trend === 'down' ? TrendingDown : Minus;
                    const trendColor = v.trend === 'up' ? 'text-[#ef4444]' : v.trend === 'down' ? 'text-[#10b981]' : 'text-[#94a3b8]';
                    return (
                      <div key={v.category}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-[#314158]">{v.category}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#0f172b]">{v.count}</span>
                            <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} />
                            <span className="text-xs text-[#62748e] w-7 text-right">{v.percentage}%</span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-[#f1f5f9] rounded-full">
                          <div className="h-full bg-[#3b82f6] rounded-full" style={{ width: `${v.percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Driver Risk Analysis */}
            <motion.div variants={itemVariants} className="bg-white border border-[#e5e7eb] rounded-lg p-6">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h3 className="text-base font-semibold text-[#0f172b]">Driver Risk Analysis</h3>
                  <p className="text-xs text-[#62748e] mt-0.5">Click a row to view driver details</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={driverSearch}
                      onChange={(e) => setDriverSearch(e.target.value)}
                      placeholder="Search drivers..."
                      className="pl-9 pr-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 text-[#0f172b] w-48"
                    />
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm text-[#62748e] hover:bg-[#f8fafc] transition-colors">
                    <Filter className="w-3.5 h-3.5" />
                    Filter
                  </button>
                </div>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#f1f5f9]">
                      {['Driver Name', 'Inspections', 'Violations', 'Most Recent', 'Top Issue', 'Risk Level'].map((h) => (
                        <th
                          key={h}
                          className={`text-left text-xs font-semibold text-[#62748e] uppercase tracking-wide pb-3 pr-4 whitespace-nowrap${h === 'Risk Level' ? ' min-w-[110px]' : ''}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDrivers.map((d) => {
                      const isSelected = selectedDriver?.driverId === d.driverId;
                      return (
                        <tr
                          key={d.driverId}
                          onClick={() => handleDriverClick(d)}
                          className={`border-b border-[#f8fafc] cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-[#eff6ff] hover:bg-[#dbeafe]'
                              : 'hover:bg-[#f8fafc]'
                          }`}
                        >
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6] text-xs font-bold">
                                {d.initials}
                              </div>
                              <span className={`text-sm font-medium ${isSelected ? 'text-[#155dfc]' : 'text-[#0f172b]'}`}>
                                {d.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-sm text-[#314158]">{d.inspections}</td>
                          <td className="py-3 pr-4 text-sm font-semibold text-[#0f172b]">{d.violations}</td>
                          <td className="py-3 pr-4 text-sm text-[#62748e]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                            {d.mostRecent}
                          </td>
                          <td className="py-3 pr-4 text-sm text-[#314158]">{d.topIssue}</td>
                          <td className="py-3 pr-4">
                            <RiskBadge risk={d.risk} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Inspection History */}
            <motion.div variants={itemVariants} className="bg-white border border-[#e5e7eb] rounded-lg p-6">
              <div className="mb-5">
                <h3 className="text-base font-semibold text-[#0f172b]">Unsafe Driving Inspection History</h3>
                <p className="text-xs text-[#62748e] mt-0.5">Detailed inspection records with AI insights</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#f1f5f9]">
                      {['Date', 'Location', 'Driver', 'Violation Type', 'Severity', 'OOS', 'Status'].map((h) => (
                        <th key={h} className="text-left text-xs font-semibold text-[#62748e] uppercase tracking-wide pb-3 pr-4">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {inspectionHistory.map((row, i) => (
                      <tr key={i} className="border-b border-[#f8fafc] hover:bg-[#f8fafc] transition-colors">
                        <td className="py-3 pr-4 text-sm text-[#62748e]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {row.date}
                        </td>
                        <td className="py-3 pr-4 text-sm text-[#314158]">{row.location}</td>
                        <td className="py-3 pr-4 text-sm font-medium text-[#0f172b]">{row.driver}</td>
                        <td className="py-3 pr-4 text-sm text-[#314158]">{row.violationType}</td>
                        <td className="py-3 pr-4">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                            row.severity === 'High' ? 'bg-[#fef2f2] text-[#dc2626]' :
                            row.severity === 'Medium' ? 'bg-[#fff7ed] text-[#c2410c]' :
                            'bg-[#f0fdf4] text-[#15803d]'
                          }`}>
                            {row.severity}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          {row.oos ? (
                            <span className="text-xs font-semibold text-[#dc2626] bg-[#fef2f2] px-2 py-0.5 rounded">Yes</span>
                          ) : (
                            <span className="text-xs text-[#62748e]">No</span>
                          )}
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-1.5">
                            {row.status === 'Pending'
                              ? <Clock className="w-3.5 h-3.5 text-[#f59e0b]" />
                              : <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />}
                            <span className={`text-xs font-medium ${row.status === 'Pending' ? 'text-[#f59e0b]' : 'text-[#10b981]'}`}>
                              {row.status}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column */}
          <div className="w-[320px] shrink-0 space-y-5">
            {/* Smart Alerts */}
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[#0f172b]">Smart Alerts</h3>
                <span className="text-xs font-medium text-[#3b82f6] bg-[#eff6ff] px-2 py-0.5 rounded-full">
                  4 Active
                </span>
              </div>
              <div className="space-y-4">
                {smartAlerts.map((alert) => {
                  const bgColor =
                    alert.severity === 'critical' ? 'bg-[#fef2f2] border-[#fecaca]' :
                    alert.severity === 'high' ? 'bg-[#fff7ed] border-[#fed7aa]' :
                    'bg-[#fffbeb] border-[#fde68a]';
                  return (
                    <div key={alert.id} className={`p-3 rounded-lg border ${bgColor}`}>
                      <div className="flex items-start gap-2 mb-1">
                        <AlertSeverityDot severity={alert.severity} />
                        <span className="text-xs font-semibold text-[#0f172b] leading-tight">{alert.title}</span>
                      </div>
                      <p className="text-xs text-[#62748e] leading-relaxed ml-4 mb-1">{alert.description}</p>
                      <span className="text-[10px] text-[#94a3b8] ml-4">{alert.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Center */}
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-5">
              <h3 className="text-sm font-semibold text-[#0f172b] mb-4">Action Center</h3>
              <div className="space-y-2">
                {actionItems.map((action, i) => {
                  const priorityColor = action.priority === 'high' ? 'text-[#dc2626]' : action.priority === 'medium' ? 'text-[#f59e0b]' : 'text-[#94a3b8]';
                  const Icon = action.priority === 'high' ? AlertTriangle : action.priority === 'medium' ? Clock : Activity;
                  return (
                    <button
                      key={i}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#f8fafc] transition-colors group text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${priorityColor}`} />
                        <span className="text-xs font-medium text-[#314158] group-hover:text-[#0f172b] transition-colors">
                          {action.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0f172b]">{action.count}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#cbd5e1] group-hover:text-[#3b82f6] transition-colors" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
