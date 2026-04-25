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
  Truck,
  AlertOctagon,
  Activity,
  Wrench,
  Settings,
  AlertCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { BasicPageData } from '@/lib/basic-data-adapter';
import type { CarrierBrief } from '@/lib/types';

// Mock data
const trendData = [
  { month: 'Apr 25', inspections: 14, violations: 11, oos: 3, percentile: 68 },
  { month: 'May 25', inspections: 16, violations: 13, oos: 4, percentile: 71 },
  { month: 'Jun 25', inspections: 13, violations: 10, oos: 2, percentile: 65 },
  { month: 'Jul 25', inspections: 19, violations: 15, oos: 5, percentile: 76 },
  { month: 'Aug 25', inspections: 15, violations: 12, oos: 3, percentile: 69 },
  { month: 'Sep 25', inspections: 17, violations: 14, oos: 4, percentile: 73 },
  { month: 'Oct 25', inspections: 14, violations: 11, oos: 3, percentile: 68 },
  { month: 'Nov 25', inspections: 18, violations: 16, oos: 6, percentile: 78 },
  { month: 'Dec 25', inspections: 20, violations: 17, oos: 5, percentile: 81 },
  { month: 'Jan 26', inspections: 22, violations: 19, oos: 7, percentile: 84 },
  { month: 'Feb 26', inspections: 19, violations: 15, oos: 5, percentile: 76 },
  { month: 'Mar 26', inspections: 17, violations: 13, oos: 4, percentile: 72 },
];

const issueBreakdown = [
  { category: 'Brakes', count: 42, percentage: 31, trend: 'up', oosRate: 38 },
  { category: 'Tires', count: 28, percentage: 21, trend: 'up', oosRate: 25 },
  { category: 'Lights', count: 24, percentage: 18, trend: 'stable', oosRate: 8 },
  { category: 'Suspension', count: 15, percentage: 11, trend: 'down', oosRate: 20 },
  { category: 'Coupling Devices', count: 11, percentage: 8, trend: 'stable', oosRate: 36 },
  { category: 'Steering', count: 8, percentage: 6, trend: 'up', oosRate: 50 },
  { category: 'Emergency Equipment', count: 7, percentage: 5, trend: 'down', oosRate: 0 },
];

const unitData = [
  { unitId: 'T-445', type: 'Tractor', inspections: 6, violations: 5, oos: 2, lastEvent: '2026-04-10', topIssue: 'Brakes', risk: 'high', status: 'pending' },
  { unitId: 'TR-892', type: 'Trailer', inspections: 5, violations: 5, oos: 3, lastEvent: '2026-04-08', topIssue: 'Lights', risk: 'critical', status: 'in-repair' },
  { unitId: 'T-501', type: 'Tractor', inspections: 5, violations: 4, oos: 2, lastEvent: '2026-04-05', topIssue: 'Tires', risk: 'high', status: 'pending' },
  { unitId: 'TR-634', type: 'Trailer', inspections: 4, violations: 4, oos: 1, lastEvent: '2026-04-02', topIssue: 'Suspension', risk: 'medium', status: 'completed' },
  { unitId: 'T-288', type: 'Tractor', inspections: 4, violations: 3, oos: 1, lastEvent: '2026-03-28', topIssue: 'Brakes', risk: 'medium', status: 'in-repair' },
  { unitId: 'TR-755', type: 'Trailer', inspections: 3, violations: 3, oos: 0, lastEvent: '2026-03-25', topIssue: 'Lights', risk: 'medium', status: 'completed' },
  { unitId: 'T-633', type: 'Tractor', inspections: 3, violations: 2, oos: 0, lastEvent: '2026-03-20', topIssue: 'Coupling', risk: 'low', status: 'completed' },
];

const inspectionHistory = [
  { date: '2026-04-10', state: 'TX', unit: 'T-445', type: 'Tractor', driver: 'Marcus Rivera', level: 'Level 1', violations: ['Brake adjustment', 'Brake lining'], category: 'Brakes', oos: true, reviewed: false },
  { date: '2026-04-08', state: 'CA', unit: 'TR-892', type: 'Trailer', driver: 'Sarah Chen', level: 'Level 2', violations: ['Rear lighting'], category: 'Lights', oos: false, reviewed: true },
  { date: '2026-04-05', state: 'AZ', unit: 'T-501', type: 'Tractor', driver: 'James Thompson', level: 'Level 1', violations: ['Tire tread depth', 'Tire sidewall'], category: 'Tires', oos: true, reviewed: false },
  { date: '2026-04-02', state: 'NV', unit: 'TR-634', type: 'Trailer', driver: 'Elena Rodriguez', level: 'Level 3', violations: ['Suspension mounting'], category: 'Suspension', oos: false, reviewed: true },
  { date: '2026-03-28', state: 'OR', unit: 'T-288', type: 'Tractor', driver: 'David Park', level: 'Level 2', violations: ['Brake hose'], category: 'Brakes', oos: false, reviewed: true },
];

const alerts = [
  { id: 1, title: 'Brake defect pattern detected', description: 'Unit T-445 has 3 brake violations in 45 days', severity: 'critical', date: '1 hour ago', category: 'Recurring Defect' },
  { id: 2, title: 'Trailer lighting recurrence flagged', description: 'TR-892 rear lighting issue after recent repair', severity: 'high', date: '4 hours ago', category: 'Post-Repair Issue' },
  { id: 3, title: 'Vehicle OOS rate worsening', description: '+35% OOS events vs prior quarter', severity: 'high', date: '1 day ago', category: 'Trend Alert' },
  { id: 4, title: 'High-risk units at Dallas terminal', description: '58% of violations from Dallas fleet', severity: 'medium', date: '2 days ago', category: 'Location Pattern' },
  { id: 5, title: 'PM cycle drift identified', description: '8 units overdue for preventive maintenance', severity: 'medium', date: '3 days ago', category: 'Maintenance Schedule' },
];

const rootCauseDistribution = [
  { name: 'Preventive Maintenance Gaps', value: 35, color: '#ef4444' },
  { name: 'Pre-Trip Inspection Gaps', value: 28, color: '#f97316' },
  { name: 'Aging Asset Deterioration', value: 18, color: '#eab308' },
  { name: 'Repair Verification Failures', value: 12, color: '#3b82f6' },
  { name: 'Trailer Inspection Weakness', value: 7, color: '#94a3b8' },
];

const repeatDefects = [
  { unit: 'T-445', issue: 'Brake adjustment', occurrences: 3, lastDate: '2026-04-10', daysSinceRepair: 18 },
  { unit: 'TR-892', issue: 'Rear lighting', occurrences: 2, lastDate: '2026-04-08', daysSinceRepair: 12 },
  { unit: 'T-501', issue: 'Tire condition', occurrences: 2, lastDate: '2026-04-05', daysSinceRepair: 25 },
];

const actionItems = [
  { title: 'T-445 - Immediate Brake Inspection', priority: 'critical', count: 1 },
  { title: 'TR-892 - Lighting System Audit', priority: 'critical', count: 1 },
  { title: 'Dallas Terminal - PM Review', priority: 'high', count: 1 },
  { title: 'Unreviewed Inspections', priority: 'medium', count: 2 },
  { title: 'Overdue PM Services', priority: 'medium', count: 8 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
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

export function VehicleMaintenancePage({ onBack }: Props) {
  const [timeRange, setTimeRange] = useState('12M');
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
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
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#62748e] mb-4">
            <button
              onClick={onBack}
              className="hover:text-[#0f172b] transition-colors flex items-center gap-1"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Dashboard
            </button>
            <ChevronRight className="w-4 h-4" />
            <span>BASIC Detail</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0f172b] font-medium">Vehicle Maintenance</span>
          </div>

          {/* Title Row */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <div>
                <h1 className="text-[30px] font-semibold mb-3 text-[#0f172b]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  Vehicle Maintenance
                </h1>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1.5 bg-[#fef3c7] text-[#92400e] text-sm font-medium rounded-full">
                    Elevated
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[24px] font-bold text-[#0f172b]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      72.8
                    </span>
                    <span className="text-sm text-[#45556c]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>percentile</span>
                  </div>
                  <div className="w-px h-6 bg-[#cad5e2]"></div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#62748e]">Threshold:</span>
                    <span className="text-[#0f172b] font-medium">65.0</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#dc2626]">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">+11.3%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium transition-all border border-[#e5e7eb] flex items-center gap-2 text-[#0f172b]">
                <FileText className="w-4 h-4" />
                View All Inspections
              </button>
              <button className="px-4 py-2 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium transition-all border border-[#e5e7eb] flex items-center gap-2 text-[#0f172b]">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="px-4 py-2 bg-[#4f46e5] hover:bg-[#4338ca] rounded-lg text-sm font-medium transition-all text-white flex items-center gap-2 shadow-sm">
                <Target className="w-4 h-4" />
                Create Action Plan
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* AI Safety Analysis Panel */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#e5e7eb] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#ede9fe] rounded-lg">
                <Zap className="w-5 h-5 text-[#7c3aed]" />
              </div>
              <h2 className="text-lg font-semibold text-[#0f172b]">AI Safety Analysis</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-[#3b82f6] mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-[#0f172b] mb-2 text-sm">What This BASIC Measures</h3>
                    <p className="text-sm text-[#62748e] leading-relaxed">
                      Vehicle Maintenance compliance tracks equipment condition violations including brakes, tires, lighting, coupling devices, and structural integrity.
                      High scores indicate poor preventive maintenance, weak pre-trip discipline, or recurring defect patterns that create roadworthiness and OOS risk.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#f59e0b] mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-[#0f172b] mb-2 text-sm">Why This Score Matters</h3>
                    <p className="text-sm text-[#62748e] leading-relaxed">
                      At 72.8 percentile, this carrier shows elevated maintenance exposure exceeding the 65.0 threshold. The +11.3% trend indicates deteriorating equipment condition.
                      Primary risk: increased roadside OOS events, potential for preventable crashes, CSA intervention thresholds, and safety rating impact.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-[#ef4444] mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-[#0f172b] mb-2 text-sm">Root Causes Detected</h3>
                    <ul className="text-sm text-[#62748e] leading-relaxed space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="text-[#ef4444] mt-1">•</span>
                        <span>Brake system violations represent 31% of total violations (42 occurrences)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#ef4444] mt-1">•</span>
                        <span>Unit T-445 shows repeat brake defects after repair (3 occurrences in 45 days)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#ef4444] mt-1">•</span>
                        <span>Dallas terminal accounts for 38% of violations, indicating PM process weakness</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#ef4444] mt-1">•</span>
                        <span>OOS rate increased 35% vs prior quarter across brake and tire categories</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10b981] mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-[#0f172b] mb-2 text-sm">Recommended Prevention Steps</h3>
                    <ol className="text-sm text-[#62748e] leading-relaxed space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="text-[#10b981] font-semibold">1.</span>
                        <span>Immediate brake system audit for units T-445, T-288, and T-501</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#10b981] font-semibold">2.</span>
                        <span>Review Dallas terminal PM cycle adherence and repair verification process</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#10b981] font-semibold">3.</span>
                        <span>Implement enhanced pre-trip inspection training and compliance monitoring</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#10b981] font-semibold">4.</span>
                        <span>Establish post-repair verification protocol for repeat-offender units</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#10b981] font-semibold">5.</span>
                        <span>Prioritize replacement or retirement for high-risk aging assets</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* KPI Strip */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <KPICard label="Percentile" value="72.8" trend="up" subtext="+11.3%" />
            <KPICard label="Threshold" value="65.0" />
            <KPICard label="30D Trend" value="+18%" trend="up" />
            <KPICard label="Inspections" value="206" />
            <KPICard label="Violations" value="135" />
            <KPICard label="Units Involved" value="47" />
          </motion.div>

          {/* Trend + Breakdown Section */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trend Chart - Takes 2 columns */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-semibold mb-1 text-[#0f172b]">Vehicle Maintenance Trend</h3>
                  <p className="text-sm text-[#62748e]">Violations and OOS events over time</p>
                </div>
                <div className="flex items-center gap-2">
                  {['30D', '90D', '6M', '12M'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                        timeRange === range
                          ? 'bg-[#4f46e5] text-white'
                          : 'bg-[#f1f5f9] text-[#62748e] hover:bg-[#e2e8f0]'
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
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Line type="monotone" dataKey="violations" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 4 }} />
                  <Line type="monotone" dataKey="inspections" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} />
                  <Line type="monotone" dataKey="oos" stroke="#dc2626" strokeWidth={2} dot={{ fill: '#dc2626', r: 3 }} />
                  <Line type="monotone" dataKey="percentile" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#8b5cf6', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>

              <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#f59e0b] rounded-full"></div>
                  <span className="text-[#62748e]">Violations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#3b82f6] rounded-full"></div>
                  <span className="text-[#62748e]">Inspections</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#dc2626] rounded-full"></div>
                  <span className="text-[#62748e]">OOS Events</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#8b5cf6] rounded-full"></div>
                  <span className="text-[#62748e]">Percentile</span>
                </div>
              </div>
            </div>

            {/* Issue Breakdown */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm">
              <h3 className="text-base font-semibold mb-4 text-[#0f172b]">Issue Breakdown</h3>
              <div className="space-y-3">
                {issueBreakdown.map((item, idx) => (
                  <div key={idx} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-[#62748e] group-hover:text-[#0f172b] transition-colors">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0f172b]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {item.count}
                        </span>
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
                          className={`h-full ${
                            item.oosRate >= 30 ? 'bg-[#dc2626]' :
                            item.oosRate >= 15 ? 'bg-[#f59e0b]' : 'bg-[#3b82f6]'
                          }`}
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

          {/* Unit Risk Table */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#e5e7eb]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold mb-1 text-[#0f172b]">Unit Risk Analysis</h3>
                  <p className="text-sm text-[#62748e]">Vehicles contributing to Maintenance BASIC</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                    <input
                      type="text"
                      placeholder="Search units..."
                      className="pl-10 pr-4 py-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium transition-all border border-[#e5e7eb] flex items-center gap-2 text-[#0f172b]"
                  >
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Unit ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Inspections</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Violations</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">OOS</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Most Recent</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Top Issue</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Risk Level</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {unitData.map((unit, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-[#f9fafb] transition-colors cursor-pointer"
                      onClick={() => setSelectedUnit(unit.unitId)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-[#94a3b8]" />
                          <span className="font-mono font-semibold text-[#0f172b]">{unit.unitId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#62748e]">{unit.type}</td>
                      <td className="px-6 py-4 font-mono text-sm text-[#0f172b]">{unit.inspections}</td>
                      <td className="px-6 py-4 font-mono text-sm text-[#f59e0b]">{unit.violations}</td>
                      <td className="px-6 py-4">
                        <span className={`font-mono text-sm font-semibold ${unit.oos > 0 ? 'text-[#dc2626]' : 'text-[#94a3b8]'}`}>
                          {unit.oos}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#62748e]">{unit.lastEvent}</td>
                      <td className="px-6 py-4 text-sm text-[#0f172b]">{unit.topIssue}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          unit.risk === 'critical' ? 'bg-[#fee2e2] text-[#991b1b]' :
                          unit.risk === 'high' ? 'bg-[#fef3c7] text-[#92400e]' :
                          unit.risk === 'medium' ? 'bg-[#fef9c3] text-[#854d0e]' :
                          'bg-[#dbeafe] text-[#1e40af]'
                        }`}>
                          {unit.risk.charAt(0).toUpperCase() + unit.risk.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          unit.status === 'pending' ? 'bg-[#fee2e2] text-[#991b1b]' :
                          unit.status === 'in-repair' ? 'bg-[#fef3c7] text-[#92400e]' :
                          'bg-[#d1fae5] text-[#065f46]'
                        }`}>
                          {unit.status === 'in-repair' ? 'In Repair' : unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Repeat Defects + Root Causes */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Repeat Defects */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-[#dc2626]" />
                <h3 className="text-base font-semibold text-[#0f172b]">Repeat Defect Analysis</h3>
              </div>
              <div className="space-y-3">
                {repeatDefects.map((defect, idx) => (
                  <div key={idx} className="p-4 bg-[#fef2f2] border border-[#fecaca] rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-[#0f172b]">{defect.unit}</span>
                        <span className="px-2 py-0.5 bg-[#fee2e2] text-[#991b1b] text-xs font-semibold rounded">
                          {defect.occurrences}x
                        </span>
                      </div>
                      <span className="text-xs text-[#62748e]">{defect.lastDate}</span>
                    </div>
                    <p className="text-sm font-medium text-[#0f172b] mb-1">{defect.issue}</p>
                    <p className="text-xs text-[#dc2626]">
                      Recurring issue - {defect.daysSinceRepair} days since last repair
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Root Cause Distribution */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm">
              <h3 className="text-base font-semibold mb-4 text-[#0f172b]">Root Cause Distribution</h3>
              <div className="flex items-center justify-center mb-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={rootCauseDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {rootCauseDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {rootCauseDistribution.map((cause, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cause.color }}></div>
                      <span className="text-[#62748e]">{cause.name}</span>
                    </div>
                    <span className="font-mono font-semibold text-[#0f172b]">{cause.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Inspection History */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#e5e7eb]">
              <h3 className="text-base font-semibold mb-1 text-[#0f172b]">Maintenance Inspection History</h3>
              <p className="text-sm text-[#62748e]">Recent maintenance-related violations with insights</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase">Unit</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase">Violation</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase">OOS</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {inspectionHistory.map((inspection, idx) => (
                    <tr key={idx} className="hover:bg-[#f9fafb] transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-[#0f172b]">{inspection.date}</td>
                      <td className="px-6 py-4 text-sm text-[#62748e]">{inspection.state}</td>
                      <td className="px-6 py-4 text-sm font-mono font-semibold text-[#0f172b]">{inspection.unit}</td>
                      <td className="px-6 py-4 text-sm text-[#62748e]">{inspection.type}</td>
                      <td className="px-6 py-4 text-sm text-[#0f172b]">{inspection.driver}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {inspection.violations.map((v, i) => (
                            <span key={i} className="px-2 py-0.5 bg-[#fee2e2] text-[#991b1b] text-xs rounded">
                              {v}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-[#f1f5f9] text-[#0f172b] text-xs rounded font-medium">
                          {inspection.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {inspection.oos ? (
                          <XCircle className="w-5 h-5 text-[#dc2626]" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {inspection.reviewed ? (
                          <span className="px-2.5 py-1 bg-[#d1fae5] text-[#065f46] text-xs rounded-full font-semibold">Reviewed</span>
                        ) : (
                          <span className="px-2.5 py-1 bg-[#fef3c7] text-[#92400e] text-xs rounded-full font-semibold">Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Alert Rail + Action Center */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Alerts - 2 columns */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="w-5 h-5 text-[#dc2626]" />
                  <h3 className="text-base font-semibold text-[#0f172b]">Maintenance Alerts</h3>
                </div>
                <span className="px-2.5 py-1 bg-[#fee2e2] text-[#991b1b] text-xs font-semibold rounded-full">{alerts.length} Active</span>
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
                      'bg-[#fefce8] border-[#fef08a] hover:bg-[#fef9c3]'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`mt-0.5 p-1.5 rounded ${
                          alert.severity === 'critical' ? 'bg-[#fee2e2]' :
                          alert.severity === 'high' ? 'bg-[#fef3c7]' : 'bg-[#fef9c3]'
                        }`}>
                          {alert.severity === 'critical' ? <AlertOctagon className="w-4 h-4 text-[#dc2626]" /> :
                           alert.severity === 'high' ? <AlertTriangle className="w-4 h-4 text-[#f59e0b]" /> :
                           <Wrench className="w-4 h-4 text-[#eab308]" />}
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

            {/* Action Center */}
            <div className="bg-gradient-to-br from-[#ede9fe] to-white rounded-xl border border-[#e9d5ff] p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-[#7c3aed]" />
                <h3 className="text-base font-semibold text-[#0f172b]">Action Center</h3>
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
                View All Actions
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
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl border border-[#e5e7eb] p-4 shadow-sm"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#62748e] uppercase tracking-wider font-medium">{label}</span>
        {trend && (
          trend === 'up' ? <TrendingUp className="w-4 h-4 text-[#dc2626]" /> : <TrendingDown className="w-4 h-4 text-[#10b981]" />
        )}
      </div>
      <div className="text-2xl font-bold text-[#0f172b]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        {value}
      </div>
      {subtext && (
        <div className={`text-xs font-medium mt-1 ${trend === 'up' ? 'text-[#dc2626]' : 'text-[#10b981]'}`}>
          {subtext}
        </div>
      )}
    </motion.div>
  );
}
