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

// Mock data
const trendData = [
  { month: 'Apr 25', inspections: 12, violations: 8, percentile: 42 },
  { month: 'May 25', inspections: 15, violations: 10, percentile: 45 },
  { month: 'Jun 25', inspections: 11, violations: 7, percentile: 39 },
  { month: 'Jul 25', inspections: 18, violations: 12, percentile: 48 },
  { month: 'Aug 25', inspections: 14, violations: 9, percentile: 43 },
  { month: 'Sep 25', inspections: 16, violations: 11, percentile: 46 },
  { month: 'Oct 25', inspections: 13, violations: 8, percentile: 41 },
  { month: 'Nov 25', inspections: 17, violations: 13, percentile: 51 },
  { month: 'Dec 25', inspections: 19, violations: 14, percentile: 54 },
  { month: 'Jan 26', inspections: 21, violations: 15, percentile: 58 },
  { month: 'Feb 26', inspections: 18, violations: 12, percentile: 49 },
  { month: 'Mar 26', inspections: 16, violations: 10, percentile: 44 },
];

const violationBreakdown = [
  { category: '11-Hour Rule', count: 34, percentage: 28, trend: 'up', severity: 'high' },
  { category: '14-Hour Rule', count: 28, percentage: 23, trend: 'up', severity: 'high' },
  { category: 'False Reports of Duty Status', count: 21, percentage: 17, trend: 'stable', severity: 'critical' },
  { category: 'Form and Manner', count: 15, percentage: 13, trend: 'down', severity: 'medium' },
  { category: '60/70-Hour Rule', count: 12, percentage: 10, trend: 'up', severity: 'high' },
  { category: 'No Record of Duty Status', count: 8, percentage: 7, trend: 'stable', severity: 'medium' },
  { category: 'ELD Not Current', count: 3, percentage: 2, trend: 'down', severity: 'low' },
];

const driverData = [
  { name: 'Marcus Rivera', inspections: 8, violations: 6, lastEvent: '2026-04-10', topIssue: '14-Hour Rule', oos: 2, risk: 'high', coaching: 'pending' },
  { name: 'Sarah Chen', inspections: 7, violations: 5, lastEvent: '2026-04-08', topIssue: '11-Hour Rule', oos: 1, risk: 'high', coaching: 'completed' },
  { name: 'James Thompson', inspections: 6, violations: 4, lastEvent: '2026-04-05', topIssue: 'False Reports', oos: 3, risk: 'critical', coaching: 'pending' },
  { name: 'Elena Rodriguez', inspections: 5, violations: 3, lastEvent: '2026-04-02', topIssue: '14-Hour Rule', oos: 0, risk: 'medium', coaching: 'completed' },
  { name: 'David Park', inspections: 4, violations: 3, lastEvent: '2026-03-28', topIssue: 'Form and Manner', oos: 0, risk: 'medium', coaching: 'scheduled' },
  { name: 'Amanda Foster', inspections: 4, violations: 2, lastEvent: '2026-03-25', topIssue: '11-Hour Rule', oos: 1, risk: 'medium', coaching: 'completed' },
  { name: 'Robert Martinez', inspections: 3, violations: 2, lastEvent: '2026-03-20', topIssue: '60/70-Hour', oos: 0, risk: 'low', coaching: 'completed' },
  { name: 'Lisa Anderson', inspections: 3, violations: 1, lastEvent: '2026-03-15', topIssue: 'ELD Not Current', oos: 0, risk: 'low', coaching: 'completed' },
];

const inspectionHistory = [
  { date: '2026-04-10', state: 'TX', driver: 'Marcus Rivera', vehicle: 'T-445', violations: ['14-Hour Rule', 'Form and Manner'], oos: true, severity: 8, reviewed: false },
  { date: '2026-04-08', state: 'CA', driver: 'Sarah Chen', vehicle: 'T-392', violations: ['11-Hour Rule'], oos: false, severity: 6, reviewed: true },
  { date: '2026-04-05', state: 'AZ', driver: 'James Thompson', vehicle: 'T-501', violations: ['False Reports', '14-Hour Rule'], oos: true, severity: 10, reviewed: false },
  { date: '2026-04-02', state: 'NV', driver: 'Elena Rodriguez', vehicle: 'T-288', violations: ['14-Hour Rule'], oos: false, severity: 5, reviewed: true },
  { date: '2026-03-28', state: 'OR', driver: 'David Park', vehicle: 'T-633', violations: ['Form and Manner'], oos: false, severity: 3, reviewed: true },
];

const alerts = [
  { id: 1, title: 'Repeat 14-Hour violations detected', description: 'Marcus Rivera has 4 violations in 30 days', severity: 'critical', date: '2 hours ago', category: 'Driver Pattern' },
  { id: 2, title: 'False log pattern flagged', description: 'James Thompson paper logs inconsistent with GPS data', severity: 'high', date: '5 hours ago', category: 'Log Integrity' },
  { id: 3, title: 'HOS OOS exposure increasing', description: '+40% OOS events vs last quarter', severity: 'high', date: '1 day ago', category: 'Trend Alert' },
  { id: 4, title: 'Terminal concentration identified', description: '62% of violations from Dallas terminal', severity: 'medium', date: '2 days ago', category: 'Location Pattern' },
  { id: 5, title: 'Post-coaching recurrence', description: 'Sarah Chen new violation 8 days after coaching', severity: 'medium', date: '3 days ago', category: 'Coaching Follow-up' },
];

const operationalContributors = [
  { terminal: 'Dallas, TX', violations: 45, percentage: 37, trend: 'up' },
  { terminal: 'Phoenix, AZ', violations: 28, percentage: 23, trend: 'stable' },
  { terminal: 'Los Angeles, CA', violations: 24, percentage: 20, trend: 'down' },
  { terminal: 'Portland, OR', violations: 15, percentage: 12, trend: 'stable' },
  { terminal: 'Las Vegas, NV', violations: 9, percentage: 8, trend: 'up' },
];

const rootCauseDistribution = [
  { name: 'Fatigue / Hours Exceedance', value: 38, color: '#ef4444' },
  { name: 'Log Accuracy Issues', value: 24, color: '#f97316' },
  { name: 'ELD Process Issues', value: 18, color: '#eab308' },
  { name: 'Scheduling Pressure', value: 12, color: '#3b82f6' },
  { name: 'Manager Oversight Gaps', value: 8, color: '#94a3b8' },
];

const actionItems = [
  { title: 'Marcus Rivera - Immediate Coaching', priority: 'critical', count: 1 },
  { title: 'James Thompson - Log Audit Required', priority: 'critical', count: 1 },
  { title: 'Dallas Terminal - Dispatch Review', priority: 'high', count: 1 },
  { title: 'Unreviewed Inspections', priority: 'medium', count: 3 },
  { title: 'Scheduled Coaching Sessions', priority: 'low', count: 4 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

interface HOSCompliancePageProps {
  onBack?: () => void;
}

export function HOSCompliancePage({ onBack }: HOSCompliancePageProps) {
  const [timeRange, setTimeRange] = useState('12M');
  const [, setSelectedDriver] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-[#f9fafb]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* Header Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-[#e5e7eb] bg-white sticky top-0 z-50 shadow-sm"
      >
        <div className="max-w-[1400px] mx-auto px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-[#62748e] mb-4">
            {onBack && (
              <>
                <button
                  onClick={onBack}
                  className="hover:text-[#0f172b] transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  Dashboard
                </button>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
            <span>BASIC Detail</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0f172b] font-medium">Hours of Service</span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[30px] font-semibold mb-3 text-[#0f172b]">Hours of Service</h1>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1.5 bg-[#fef3c7] text-[#92400e] text-sm font-medium rounded-full">Elevated</span>
                <div className="flex items-center gap-2">
                  <span className="text-[24px] font-bold text-[#0f172b]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>41.6</span>
                  <span className="text-sm text-[#45556c]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>percentile</span>
                </div>
                <div className="w-px h-6 bg-[#cad5e2]" />
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#62748e]">Threshold:</span>
                  <span className="text-[#0f172b] font-medium">65.0</span>
                </div>
                <div className="flex items-center gap-1 text-[#dc2626]">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+8.2%</span>
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
                    Hours of Service compliance tracks driver duty time violations, including 11-hour driving limits, 14-hour on-duty windows,
                    60/70-hour weekly maximums, and Electronic Logging Device (ELD) accuracy. Violations indicate fatigue risk and regulatory exposure.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#f59e0b] mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-[#0f172b] mb-2 text-sm">Why This Score Matters</h3>
                  <p className="text-sm text-[#62748e] leading-relaxed">
                    At 41.6 percentile, this carrier shows elevated HOS exposure. The +8.2% trend indicates worsening compliance.
                    Primary risk: increased DOT audit probability, potential safety rating downgrade, and driver fatigue-related incidents.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-[#ef4444] mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-[#0f172b] mb-2 text-sm">Root Causes Detected</h3>
                  <ul className="text-sm text-[#62748e] leading-relaxed space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-[#ef4444] mt-1">•</span><span>Repeat 14-hour violations concentrated in Dallas terminal (37% of total)</span></li>
                    <li className="flex items-start gap-2"><span className="text-[#ef4444] mt-1">•</span><span>False log patterns detected in 3 drivers using paper logs</span></li>
                    <li className="flex items-start gap-2"><span className="text-[#ef4444] mt-1">•</span><span>Post-coaching recurrence: 40% re-violation within 30 days</span></li>
                  </ul>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#10b981] mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-[#0f172b] mb-2 text-sm">Recommended Prevention Steps</h3>
                  <ol className="text-sm text-[#62748e] leading-relaxed space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-[#10b981] font-semibold">1.</span><span>Immediate coaching for drivers with 3+ violations in 90 days</span></li>
                    <li className="flex items-start gap-2"><span className="text-[#10b981] font-semibold">2.</span><span>Audit Dallas terminal dispatch scheduling practices</span></li>
                    <li className="flex items-start gap-2"><span className="text-[#10b981] font-semibold">3.</span><span>Mandate ELD transition for paper log users within 30 days</span></li>
                    <li className="flex items-start gap-2"><span className="text-[#10b981] font-semibold">4.</span><span>Implement pre-trip HOS compliance checks for high-risk routes</span></li>
                  </ol>
                </div>
              </div>
            </div>
          </motion.div>

          {/* KPI Strip */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <KPICard label="Percentile" value="41.6" trend="down" subtext="-2.3%" />
            <KPICard label="Threshold" value="65.0" />
            <KPICard label="30D Trend" value="+12%" trend="up" />
            <KPICard label="HOS Inspections" value="189" />
            <KPICard label="HOS Violations" value="121" />
            <KPICard label="Drivers Involved" value="34" />
          </motion.div>

          {/* Trend + Breakdown */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-semibold mb-1 text-[#0f172b]">HOS Trend</h3>
                  <p className="text-sm text-[#62748e]">Violation patterns over time</p>
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
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#f59e0b] rounded-full" /><span className="text-[#62748e]">Violations</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#3b82f6] rounded-full" /><span className="text-[#62748e]">Inspections</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#8b5cf6] rounded-full" /><span className="text-[#62748e]">Percentile</span></div>
              </div>
            </div>

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
                          className={`h-full ${
                            item.severity === 'critical' ? 'bg-[#dc2626]' :
                            item.severity === 'high' ? 'bg-[#f59e0b]' :
                            item.severity === 'medium' ? 'bg-[#eab308]' : 'bg-[#3b82f6]'
                          }`}
                        />
                      </div>
                      <span className="text-xs text-[#94a3b8] w-8 text-right">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Driver Risk Table */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#e5e7eb]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold mb-1 text-[#0f172b]">Driver Risk Analysis</h3>
                  <p className="text-sm text-[#62748e]">Drivers contributing to HOS BASIC</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                    <input type="text" placeholder="Search drivers..." className="pl-10 pr-4 py-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent" />
                  </div>
                  <button onClick={() => setShowFilters(!showFilters)} className="px-4 py-2 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium transition-all border border-[#e5e7eb] flex items-center gap-2 text-[#0f172b]">
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
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Driver Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Inspections</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Violations</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Most Recent</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Top Issue</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">OOS</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Risk Level</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Coaching</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {driverData.map((driver, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-[#f9fafb] transition-colors cursor-pointer"
                      onClick={() => setSelectedDriver(driver.name)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] rounded-full flex items-center justify-center text-xs font-bold text-white">
                            {driver.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-medium text-[#0f172b]">{driver.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-[#0f172b]">{driver.inspections}</td>
                      <td className="px-6 py-4 font-mono text-sm text-[#f59e0b]">{driver.violations}</td>
                      <td className="px-6 py-4 text-sm text-[#62748e]">{driver.lastEvent}</td>
                      <td className="px-6 py-4 text-sm text-[#0f172b]">{driver.topIssue}</td>
                      <td className="px-6 py-4">
                        <span className={`font-mono text-sm ${driver.oos > 0 ? 'text-[#dc2626]' : 'text-[#94a3b8]'}`}>{driver.oos}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          driver.risk === 'critical' ? 'bg-[#fee2e2] text-[#991b1b]' :
                          driver.risk === 'high' ? 'bg-[#fef3c7] text-[#92400e]' :
                          driver.risk === 'medium' ? 'bg-[#fef9c3] text-[#854d0e]' :
                          'bg-[#dbeafe] text-[#1e40af]'
                        }`}>
                          {driver.risk.charAt(0).toUpperCase() + driver.risk.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          driver.coaching === 'pending' ? 'bg-[#fee2e2] text-[#991b1b]' :
                          driver.coaching === 'scheduled' ? 'bg-[#dbeafe] text-[#1e40af]' :
                          'bg-[#d1fae5] text-[#065f46]'
                        }`}>
                          {driver.coaching.charAt(0).toUpperCase() + driver.coaching.slice(1)}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Terminal + Root Cause */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm">
              <h3 className="text-base font-semibold mb-4 text-[#0f172b]">Terminal Contribution</h3>
              <div className="space-y-4">
                {operationalContributors.map((terminal, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#94a3b8]" />
                        <span className="text-sm font-medium text-[#0f172b]">{terminal.terminal}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#62748e]">{terminal.percentage}%</span>
                        <span className="font-mono text-sm font-bold text-[#0f172b]">{terminal.violations}</span>
                        {terminal.trend === 'up' && <TrendingUp className="w-3 h-3 text-[#dc2626]" />}
                        {terminal.trend === 'down' && <TrendingDown className="w-3 h-3 text-[#10b981]" />}
                      </div>
                    </div>
                    <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${terminal.percentage}%` }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        className="h-full bg-gradient-to-r from-[#f59e0b] to-[#dc2626]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm">
              <h3 className="text-base font-semibold mb-4 text-[#0f172b]">Root Cause Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={rootCauseDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                    {rootCauseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {rootCauseDistribution.map((cause, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cause.color }} />
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
              <h3 className="text-base font-semibold mb-1 text-[#0f172b]">HOS Inspection History</h3>
              <p className="text-sm text-[#62748e]">Detailed inspection records with AI insights</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase">Violation Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase">Severity</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase">OOS</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {inspectionHistory.map((inspection, idx) => (
                    <tr key={idx} className="hover:bg-[#f9fafb] transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-[#0f172b]">{inspection.date}</td>
                      <td className="px-6 py-4 text-sm text-[#62748e]">{inspection.state}</td>
                      <td className="px-6 py-4 text-sm text-[#0f172b]">{inspection.driver}</td>
                      <td className="px-6 py-4 text-sm font-mono text-[#0f172b]">{inspection.vehicle}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {inspection.violations.map((v, i) => (
                            <span key={i} className="px-2 py-0.5 bg-[#fee2e2] text-[#991b1b] text-xs rounded">{v}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          inspection.severity >= 8 ? 'bg-[#fee2e2] text-[#991b1b]' :
                          inspection.severity >= 5 ? 'bg-[#fef3c7] text-[#92400e]' :
                          'bg-[#dbeafe] text-[#1e40af]'
                        }`}>
                          {inspection.severity >= 8 ? 'High' : inspection.severity >= 5 ? 'Medium' : 'Low'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {inspection.oos ? <XCircle className="w-5 h-5 text-[#dc2626]" /> : <CheckCircle2 className="w-5 h-5 text-[#10b981]" />}
                      </td>
                      <td className="px-6 py-4">
                        {inspection.reviewed
                          ? <span className="px-2.5 py-1 bg-[#d1fae5] text-[#065f46] text-xs rounded-full font-semibold">Reviewed</span>
                          : <span className="px-2.5 py-1 bg-[#fef3c7] text-[#92400e] text-xs rounded-full font-semibold">Pending</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Alerts + Action Center */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
            <div className="lg:col-span-2 bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="w-5 h-5 text-[#dc2626]" />
                  <h3 className="text-base font-semibold text-[#0f172b]">Smart Alerts</h3>
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
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`mt-0.5 p-1.5 rounded ${
                          alert.severity === 'critical' ? 'bg-[#fee2e2]' :
                          alert.severity === 'high' ? 'bg-[#fef3c7]' : 'bg-[#fef9c3]'
                        }`}>
                          {alert.severity === 'critical' ? <AlertOctagon className="w-4 h-4 text-[#dc2626]" /> :
                           alert.severity === 'high' ? <AlertTriangle className="w-4 h-4 text-[#f59e0b]" /> :
                           <Activity className="w-4 h-4 text-[#eab308]" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1 text-[#0f172b]">{alert.title}</h4>
                          <p className="text-xs text-[#62748e] mb-2">{alert.description}</p>
                          <div className="flex items-center gap-3 text-xs text-[#94a3b8]">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{alert.date}</span>
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

            <div className="bg-gradient-to-br from-[#ede9fe] to-white rounded-xl border border-[#e9d5ff] p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="w-5 h-5 text-[#7c3aed]" />
                <h3 className="text-base font-semibold text-[#0f172b]">Action Center</h3>
              </div>
              <div className="space-y-3">
                {actionItems.map((action, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-[#e9d5ff] hover:border-[#c4b5fd] transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-sm font-medium group-hover:text-[#7c3aed] transition-colors text-[#0f172b]">{action.title}</span>
                      {action.count > 1 && (
                        <span className="px-2 py-0.5 bg-[#ede9fe] text-[#7c3aed] text-xs font-semibold rounded">{action.count}</span>
                      )}
                    </div>
                    <span className={`text-xs font-semibold ${
                      action.priority === 'critical' ? 'text-[#dc2626]' :
                      action.priority === 'high' ? 'text-[#f59e0b]' :
                      action.priority === 'medium' ? 'text-[#eab308]' : 'text-[#94a3b8]'
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
      {subtext && (
        <div className={`text-xs font-medium mt-1 ${trend === 'up' ? 'text-[#dc2626]' : 'text-[#10b981]'}`}>{subtext}</div>
      )}
    </motion.div>
  );
}
