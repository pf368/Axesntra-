'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  FileText,
  Download,
  Filter,
  Search,
  ChevronRight,
  Shield,
  Zap,
  Target,
  CheckCircle2,
  XCircle,
  MinusCircle,
  MapPin,
  AlertOctagon,
  Activity,
  Briefcase,
  Eye,
  FileCheck,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import type { BasicPageData } from '@/lib/basic-data-adapter';
import type { CarrierBrief } from '@/lib/types';

// Mock data
const trendData = [
  { month: 'Apr 25', inspections: 2, violations: 1, oos: 0, percentile: 4 },
  { month: 'May 25', inspections: 1, violations: 1, oos: 0, percentile: 5 },
  { month: 'Jun 25', inspections: 0, violations: 0, oos: 0, percentile: 3 },
  { month: 'Jul 25', inspections: 1, violations: 1, oos: 1, percentile: 6 },
  { month: 'Aug 25', inspections: 0, violations: 0, oos: 0, percentile: 4 },
  { month: 'Sep 25', inspections: 1, violations: 1, oos: 0, percentile: 5 },
  { month: 'Oct 25', inspections: 0, violations: 0, oos: 0, percentile: 4 },
  { month: 'Nov 25', inspections: 1, violations: 1, oos: 0, percentile: 5 },
  { month: 'Dec 25', inspections: 0, violations: 0, oos: 0, percentile: 4 },
  { month: 'Jan 26', inspections: 1, violations: 1, oos: 0, percentile: 5 },
  { month: 'Feb 26', inspections: 0, violations: 0, oos: 0, percentile: 4 },
  { month: 'Mar 26', inspections: 1, violations: 1, oos: 0, percentile: 5 },
];

const violationBreakdown = [
  { category: 'Alcohol-related violations', count: 3, percentage: 50, trend: 'stable', oosRate: 33 },
  { category: 'Controlled substance-related', count: 2, percentage: 33, trend: 'stable', oosRate: 0 },
  { category: 'Operating while prohibited', count: 1, percentage: 17, trend: 'stable', oosRate: 0 },
];

const inspectionHistory = [
  { date: '2026-03-15', state: 'CA', level: 'Level 3', driver: 'Michael Rodriguez', vehicle: 'T-521', code: '392.4', description: 'Operating CMV while under influence of alcohol', oos: false, severity: 'high', reviewed: false },
  { date: '2026-01-22', state: 'TX', level: 'Level 2', driver: 'David Wilson', vehicle: 'T-389', code: '392.5', description: 'Operating CMV while under influence of drugs', oos: false, severity: 'high', reviewed: true },
  { date: '2025-09-18', state: 'AZ', level: 'Level 3', driver: 'Robert Johnson', vehicle: 'T-445', code: '392.4', description: 'Alcohol concentration 0.02 or greater', oos: false, severity: 'medium', reviewed: true },
  { date: '2025-07-10', state: 'NV', level: 'Level 1', driver: 'James Martinez', vehicle: 'T-501', code: '392.5', description: 'Controlled substance possession', oos: true, severity: 'critical', reviewed: true },
  { date: '2025-05-03', state: 'CA', level: 'Level 2', driver: 'Thomas Anderson', vehicle: 'T-633', code: '392.4', description: 'On-duty use of alcohol', oos: false, severity: 'high', reviewed: true },
  { date: '2025-04-28', state: 'OR', level: 'Level 3', driver: 'Christopher Lee', vehicle: 'T-288', code: '392.5', description: 'Use of controlled substance', oos: false, severity: 'high', reviewed: true },
];

const alerts = [
  { id: 1, title: 'Recent inspection cluster detected', description: '2 inspections in last 90 days vs 4 in prior 12 months', severity: 'medium', date: '2 days ago', category: 'Activity Pattern' },
  { id: 2, title: 'OOS-related event identified', description: 'July 2025 controlled substance possession resulted in OOS', severity: 'high', date: '9 months ago', category: 'OOS Event' },
  { id: 3, title: 'Geographic concentration in CA', description: '33% of violations occurred in California', severity: 'low', date: 'Last 12 months', category: 'Location Pattern' },
  { id: 4, title: 'Most recent event in current period', description: 'March 2026 alcohol-related inspection requires review', severity: 'medium', date: '1 month ago', category: 'Recent Activity' },
];

const locationData = [
  { state: 'CA', count: 2, percentage: 33 },
  { state: 'TX', count: 1, percentage: 17 },
  { state: 'AZ', count: 1, percentage: 17 },
  { state: 'NV', count: 1, percentage: 17 },
  { state: 'OR', count: 1, percentage: 17 },
];

const patternInsights = [
  { name: 'Inspection Frequency', value: 'Low (6 in 12 months)', color: '#10b981' },
  { name: 'Driver Concentration', value: 'Distributed (no repeats)', color: '#3b82f6' },
  { name: 'Geographic Pattern', value: 'Multi-state (5 states)', color: '#eab308' },
  { name: 'OOS Rate', value: 'Low (17% of violations)', color: '#f59e0b' },
];

const actionItems = [
  { title: 'Review March 2026 Inspection', priority: 'medium', count: 1 },
  { title: 'Review California Concentration', priority: 'low', count: 2 },
  { title: 'Export Violation History', priority: 'low', count: 1 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  basicData: BasicPageData;
  carrier: CarrierBrief;
  onBack: () => void;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ControlledSubstancesPage({ onBack }: Props) {
  const [timeRange, setTimeRange] = useState('12M');
  const [selectedInspection, setSelectedInspection] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-[#f9fafb]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* Header Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-[#e5e7eb] bg-white sticky top-0 z-50 shadow-sm"
      >
        <div className="max-w-[1400px] mx-auto px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-[#62748e] mb-4">
            <button onClick={onBack} className="hover:text-[#0f172b] transition-colors flex items-center gap-1">
              <ChevronRight className="w-4 h-4 rotate-180" />
              Dashboard
            </button>
            <ChevronRight className="w-4 h-4" />
            <span>BASIC Detail</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0f172b] font-medium">Controlled Substances and Alcohol</span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[30px] font-semibold mb-3 text-[#0f172b]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                Controlled Substances and Alcohol
              </h1>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1.5 bg-[#d1fae5] text-[#065f46] text-sm font-medium rounded-full">Within Threshold</span>
                <div className="flex items-center gap-2">
                  <span className="text-[24px] font-bold text-[#0f172b]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>5.1</span>
                  <span className="text-sm text-[#45556c]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>percentile</span>
                </div>
                <div className="w-px h-6 bg-[#cad5e2]" />
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#62748e]">Threshold:</span>
                  <span className="text-[#0f172b] font-medium">65.0</span>
                </div>
                <div className="flex items-center gap-1 text-[#10b981]">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-sm font-medium">-0.5%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium transition-all border border-[#e5e7eb] flex items-center gap-2 text-[#0f172b]">
                <FileText className="w-4 h-4" />View All Inspections
              </button>
              <button className="px-4 py-2 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium transition-all border border-[#e5e7eb] flex items-center gap-2 text-[#0f172b]">
                <Download className="w-4 h-4" />Export
              </button>
              <button className="px-4 py-2 bg-[#4f46e5] hover:bg-[#4338ca] rounded-lg text-sm font-medium transition-all text-white flex items-center gap-2 shadow-sm">
                <FileCheck className="w-4 h-4" />Create Review List
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">

          {/* AI Safety Analysis Panel */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#e5e7eb] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#ede9fe] rounded-lg">
                <Zap className="w-5 h-5 text-[#7c3aed]" />
              </div>
              <h2 className="text-lg font-semibold text-[#0f172b]">AI Safety Analysis</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#3b82f6] mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-[#0f172b] mb-2 text-sm">What This BASIC Measures</h3>
                  <p className="text-sm text-[#62748e] leading-relaxed">
                    Controlled Substances and Alcohol tracks roadside inspection violations related to alcohol use, controlled substance possession or use,
                    and operating while under the influence. This BASIC captures serious safety violations identified during Level 1, 2, and 3 inspections
                    that may result in out-of-service orders and create significant liability exposure.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#f59e0b] mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-[#0f172b] mb-2 text-sm">Why This BASIC Matters</h3>
                  <p className="text-sm text-[#62748e] leading-relaxed">
                    At 5.1 percentile, this carrier maintains strong compliance well within the 65.0 threshold. The -0.5% trend indicates stable performance.
                    However, even low-frequency violations in this category create severe risk due to zero-tolerance enforcement policies and potential
                    for catastrophic incidents. Continued monitoring and preventive measures remain critical.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-[#3b82f6] mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-[#0f172b] mb-2 text-sm">Inspection Patterns Detected</h3>
                  <ul className="text-sm text-[#62748e] leading-relaxed space-y-1.5">
                    {[
                      'Low inspection frequency: 6 relevant inspections over trailing 12 months',
                      'No driver repetition detected - all inspections involved different drivers',
                      'Geographic distribution across 5 states with 33% concentration in California',
                      'One OOS event identified in July 2025 for controlled substance possession',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#3b82f6] mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#10b981] mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-[#0f172b] mb-2 text-sm">Recommended Review Priorities</h3>
                  <ol className="text-sm text-[#62748e] leading-relaxed space-y-1.5">
                    {[
                      'Review March 2026 alcohol-related inspection for follow-up and documentation',
                      'Audit California concentration to identify potential operational or regional risk factors',
                      'Verify driver training records and substance abuse policy acknowledgment for all active drivers',
                      'Maintain current monitoring and preventive measures to sustain low violation frequency',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#10b981] font-semibold">{i + 1}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </motion.div>

          {/* KPI Strip */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <KPICard label="Percentile" value="5.1" trend="down" subtext="-0.5%" />
            <KPICard label="Threshold" value="65.0" />
            <KPICard label="30D Trend" value="-1%" trend="down" />
            <KPICard label="Inspections" value="6" />
            <KPICard label="Violations" value="6" />
            <KPICard label="OOS Events" value="1" />
          </motion.div>

          {/* Trend + Breakdown Section */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-semibold mb-1 text-[#0f172b]">Inspection Activity Trend</h3>
                  <p className="text-sm text-[#62748e]">CSA-related inspection patterns over time</p>
                </div>
                <div className="flex items-center gap-2">
                  {['30D', '90D', '6M', '12M'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                        timeRange === range ? 'bg-[#4f46e5] text-white' : 'bg-[#f1f5f9] text-[#62748e] hover:bg-[#e2e8f0]'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '11px' }} />
                  <YAxis stroke="#94a3b8" style={{ fontSize: '11px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="violations" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 4 }} />
                  <Line type="monotone" dataKey="inspections" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} />
                  <Line type="monotone" dataKey="percentile" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#8b5cf6', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>

              <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                {[{ color: '#f59e0b', label: 'Violations' }, { color: '#3b82f6', label: 'Inspections' }, { color: '#8b5cf6', label: 'Percentile' }].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-[#62748e]">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Violation Breakdown */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm">
              <h3 className="text-base font-semibold mb-4 text-[#0f172b]">Violation Breakdown</h3>
              <div className="space-y-3">
                {violationBreakdown.map((item, idx) => (
                  <div key={idx} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-[#62748e] group-hover:text-[#0f172b] transition-colors">{item.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0f172b]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{item.count}</span>
                        {item.trend === 'up' && <TrendingUp className="w-3 h-3 text-[#dc2626]" />}
                        {item.trend === 'down' && <TrendingDown className="w-3 h-3 text-[#10b981]" />}
                        {item.trend === 'stable' && <MinusCircle className="w-3 h-3 text-[#94a3b8]" />}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ duration: 0.6, delay: idx * 0.1 }}
                          className={`h-full ${item.oosRate >= 30 ? 'bg-[#dc2626]' : item.oosRate >= 15 ? 'bg-[#f59e0b]' : 'bg-[#3b82f6]'}`}
                        />
                      </div>
                      <span className="text-xs text-[#94a3b8] w-8 text-right">{item.percentage}%</span>
                    </div>
                    <div className="mt-1 text-xs text-[#62748e]">OOS Rate: {item.oosRate}%</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Inspection History Table */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#e5e7eb]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold mb-1 text-[#0f172b]">Inspection History</h3>
                  <p className="text-sm text-[#62748e]">CSA inspection records for this BASIC</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                    <input
                      type="text"
                      placeholder="Search inspections..."
                      className="pl-10 pr-4 py-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium transition-all border border-[#e5e7eb] flex items-center gap-2 text-[#0f172b]"
                  >
                    <Filter className="w-4 h-4" />Filter
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                  <tr>
                    {['Date', 'State', 'Level', 'Driver', 'Vehicle', 'Code', 'Description', 'OOS', 'Status'].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {inspectionHistory.map((inspection, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-[#f9fafb] transition-colors cursor-pointer"
                      onClick={() => setSelectedInspection(inspection.date)}
                    >
                      <td className="px-6 py-4 text-sm font-mono text-[#0f172b]">{inspection.date}</td>
                      <td className="px-6 py-4 text-sm text-[#62748e]">{inspection.state}</td>
                      <td className="px-6 py-4 text-sm text-[#62748e]">{inspection.level}</td>
                      <td className="px-6 py-4 text-sm text-[#0f172b]">{inspection.driver}</td>
                      <td className="px-6 py-4 text-sm font-mono text-[#0f172b]">{inspection.vehicle}</td>
                      <td className="px-6 py-4 text-sm font-mono text-[#0f172b]">{inspection.code}</td>
                      <td className="px-6 py-4 text-sm text-[#62748e] max-w-xs truncate">{inspection.description}</td>
                      <td className="px-6 py-4">
                        {inspection.oos
                          ? <XCircle className="w-5 h-5 text-[#dc2626]" />
                          : <CheckCircle2 className="w-5 h-5 text-[#10b981]" />}
                      </td>
                      <td className="px-6 py-4">
                        {inspection.reviewed
                          ? <span className="px-2.5 py-1 bg-[#d1fae5] text-[#065f46] text-xs rounded-full font-semibold">Reviewed</span>
                          : <span className="px-2.5 py-1 bg-[#fef3c7] text-[#92400e] text-xs rounded-full font-semibold">Pending</span>}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Pattern Analysis Section */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Geographic Distribution */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-[#3b82f6]" />
                <h3 className="text-base font-semibold text-[#0f172b]">Geographic Distribution</h3>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={locationData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#94a3b8" style={{ fontSize: '11px' }} />
                  <YAxis dataKey="state" type="category" width={40} stroke="#94a3b8" style={{ fontSize: '11px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pattern Insights */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm">
              <h3 className="text-base font-semibold mb-4 text-[#0f172b]">Pattern Insights</h3>
              <div className="space-y-3">
                {patternInsights.map((insight, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-[#f9fafb] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: insight.color }} />
                      <span className="text-sm font-medium text-[#0f172b]">{insight.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-[#62748e]">{insight.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Alert Rail + Action Center */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Alerts - 2 columns */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="w-5 h-5 text-[#3b82f6]" />
                  <h3 className="text-base font-semibold text-[#0f172b]">Inspection Intelligence</h3>
                </div>
                <span className="px-2.5 py-1 bg-[#dbeafe] text-[#1e40af] text-xs font-semibold rounded-full">{alerts.length} Insights</span>
              </div>

              <div className="space-y-3">
                {alerts.map((alert, idx) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer ${
                      alert.severity === 'critical' ? 'bg-[#fef2f2] border-[#fecaca] hover:bg-[#fee2e2]' :
                      alert.severity === 'high' ? 'bg-[#fffbeb] border-[#fde68a] hover:bg-[#fef3c7]' :
                      alert.severity === 'medium' ? 'bg-[#fefce8] border-[#fef08a] hover:bg-[#fef9c3]' :
                      'bg-[#f0f9ff] border-[#bae6fd] hover:bg-[#e0f2fe]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`mt-0.5 p-1.5 rounded ${
                          alert.severity === 'critical' ? 'bg-[#fee2e2]' :
                          alert.severity === 'high' ? 'bg-[#fef3c7]' :
                          alert.severity === 'medium' ? 'bg-[#fef9c3]' : 'bg-[#dbeafe]'
                        }`}>
                          {alert.severity === 'critical' ? <AlertOctagon className="w-4 h-4 text-[#dc2626]" /> :
                           alert.severity === 'high' ? <AlertTriangle className="w-4 h-4 text-[#f59e0b]" /> :
                           alert.severity === 'medium' ? <Activity className="w-4 h-4 text-[#eab308]" /> :
                           <Eye className="w-4 h-4 text-[#3b82f6]" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1 text-[#0f172b]">{alert.title}</h4>
                          <p className="text-xs text-[#62748e] mb-2">{alert.description}</p>
                          <div className="flex items-center gap-3 text-xs text-[#94a3b8]">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {alert.date}
                            </span>
                            <span className="px-2 py-0.5 bg-white rounded text-[#62748e]">{alert.category}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#94a3b8] flex-shrink-0" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Review Queue */}
            <div className="bg-gradient-to-br from-[#ede9fe] to-white rounded-xl border border-[#e9d5ff] p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="w-5 h-5 text-[#7c3aed]" />
                <h3 className="text-base font-semibold text-[#0f172b]">Review Queue</h3>
              </div>

              <div className="space-y-3">
                {actionItems.map((action, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-lg border border-[#e9d5ff] hover:border-[#c4b5fd] transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-sm font-medium group-hover:text-[#7c3aed] transition-colors text-[#0f172b]">
                        {action.title}
                      </span>
                      {action.count > 1 && (
                        <span className="px-2 py-0.5 bg-[#ede9fe] text-[#7c3aed] text-xs font-semibold rounded">
                          {action.count}
                        </span>
                      )}
                    </div>
                    <span className={`text-xs font-semibold ${
                      action.priority === 'critical' ? 'text-[#dc2626]' :
                      action.priority === 'high' ? 'text-[#f59e0b]' :
                      action.priority === 'medium' ? 'text-[#eab308]' :
                      'text-[#94a3b8]'
                    }`}>
                      {action.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 px-4 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-lg font-semibold transition-all text-sm text-white shadow-sm">
                Export Review List
              </button>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

interface KPICardProps {
  label: string;
  value: string;
  trend?: 'up' | 'down';
  subtext?: string;
}

function KPICard({ label, value, trend, subtext }: KPICardProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl border border-[#e5e7eb] p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#62748e] uppercase tracking-wider font-medium">{label}</span>
        {trend && (trend === 'up' ? <TrendingUp className="w-4 h-4 text-[#dc2626]" /> : <TrendingDown className="w-4 h-4 text-[#10b981]" />)}
      </div>
      <div className="text-2xl font-bold text-[#0f172b]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{value}</div>
      {subtext && <div className={`text-xs font-medium mt-1 ${trend === 'up' ? 'text-[#dc2626]' : 'text-[#10b981]'}`}>{subtext}</div>}
    </motion.div>
  );
}
