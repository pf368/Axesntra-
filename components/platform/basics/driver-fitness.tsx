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
  MinusCircle,
  AlertOctagon,
  Activity,
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
} from 'recharts';
import type { BasicPageData } from '@/lib/basic-data-adapter';
import type { CarrierBrief } from '@/lib/types';

// Mock data
const trendData = [
  { month: 'Apr 25', inspections: 9, violations: 6, percentile: 35 },
  { month: 'May 25', inspections: 11, violations: 7, percentile: 38 },
  { month: 'Jun 25', inspections: 8, violations: 5, percentile: 32 },
  { month: 'Jul 25', inspections: 13, violations: 9, percentile: 42 },
  { month: 'Aug 25', inspections: 10, violations: 7, percentile: 36 },
  { month: 'Sep 25', inspections: 12, violations: 8, percentile: 39 },
  { month: 'Oct 25', inspections: 9, violations: 6, percentile: 35 },
  { month: 'Nov 25', inspections: 14, violations: 10, percentile: 44 },
  { month: 'Dec 25', inspections: 15, violations: 11, percentile: 46 },
  { month: 'Jan 26', inspections: 16, violations: 12, percentile: 49 },
  { month: 'Feb 26', inspections: 13, violations: 9, percentile: 40 },
  { month: 'Mar 26', inspections: 11, violations: 7, percentile: 38 },
];

const issueBreakdown = [
  { category: 'Medical Certificate Expired', count: 18, percentage: 32, trend: 'up', urgency: 'critical' },
  { category: 'Medical Certificate Missing', count: 12, percentage: 21, trend: 'stable', urgency: 'critical' },
  { category: 'CDL / License Issue', count: 10, percentage: 18, trend: 'down', urgency: 'high' },
  { category: 'Qualification File Incomplete', count: 8, percentage: 14, trend: 'up', urgency: 'medium' },
  { category: 'Wrong Class / Endorsement', count: 5, percentage: 9, trend: 'stable', urgency: 'high' },
  { category: 'Renewal Lapse', count: 3, percentage: 5, trend: 'down', urgency: 'medium' },
];

const driverData = [
  { name: 'Robert Martinez', lastEvent: '2026-04-12', topIssue: 'Medical Expired', daysStatus: -8, risk: 'critical', status: 'pending' },
  { name: 'James Thompson', lastEvent: '2026-04-10', topIssue: 'Medical Expired', daysStatus: -3, risk: 'critical', status: 'in-review' },
  { name: 'Elena Rodriguez', lastEvent: '2026-04-08', topIssue: 'Medical Expiring', daysStatus: 12, risk: 'high', status: 'pending' },
  { name: 'David Park', lastEvent: '2026-04-05', topIssue: 'Medical Expiring', daysStatus: 18, risk: 'medium', status: 'in-review' },
  { name: 'Sarah Chen', lastEvent: '2026-04-02', topIssue: 'Qual File', daysStatus: 0, risk: 'medium', status: 'pending' },
  { name: 'Marcus Rivera', lastEvent: '2026-03-28', topIssue: 'License Expiring', daysStatus: 25, risk: 'low', status: 'completed' },
];

const inspectionHistory = [
  { date: '2026-04-12', state: 'TX', driver: 'Robert Martinez', vehicle: 'T-445', level: 'Level 3', violations: ['Medical certificate expired'], category: 'Medical Certificate', urgency: 'critical', reviewed: false },
  { date: '2026-04-10', state: 'CA', driver: 'James Thompson', vehicle: 'T-392', level: 'Level 3', violations: ['Medical certificate expired'], category: 'Medical Certificate', urgency: 'critical', reviewed: false },
  { date: '2026-04-08', state: 'AZ', driver: 'Elena Rodriguez', vehicle: 'T-501', level: 'Level 2', violations: ['Medical certificate expiring'], category: 'Medical Certificate', urgency: 'high', reviewed: true },
  { date: '2026-04-05', state: 'NV', driver: 'David Park', vehicle: 'T-288', level: 'Level 3', violations: ['Qualification file incomplete'], category: 'Qualification File', urgency: 'medium', reviewed: true },
  { date: '2026-04-02', state: 'OR', driver: 'Sarah Chen', vehicle: 'T-633', level: 'Level 2', violations: ['CDL endorsement mismatch'], category: 'CDL / License', urgency: 'high', reviewed: true },
];

const alerts = [
  { id: 1, title: 'Medical certificate lapse detected', description: 'Robert Martinez medical card expired 8 days ago', severity: 'critical', date: '30 mins ago', category: 'Expired Credential' },
  { id: 2, title: 'Qualification files incomplete', description: '3 drivers missing required documentation', severity: 'high', date: '2 hours ago', category: 'Documentation Gap' },
  { id: 3, title: 'Expiration cluster approaching', description: '5 medical certificates expiring in next 30 days', severity: 'high', date: '6 hours ago', category: 'Expiration Risk' },
  { id: 4, title: 'Repeat administrative noncompliance', description: 'James Thompson 3rd medical lapse in 18 months', severity: 'medium', date: '1 day ago', category: 'Repeat Issue' },
  { id: 5, title: 'Open remediation backlog', description: '7 unresolved qualification issues pending >14 days', severity: 'medium', date: '2 days ago', category: 'Backlog Alert' },
];

const actionItems = [
  { title: 'Robert Martinez - Immediate Review', priority: 'critical', count: 1 },
  { title: 'James Thompson - Medical Follow-up', priority: 'critical', count: 1 },
  { title: 'Qualification File Audits', priority: 'high', count: 3 },
  { title: 'Expiring Credential Renewals', priority: 'medium', count: 5 },
  { title: 'Overdue Reviews', priority: 'medium', count: 7 },
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

export function DriverFitnessPage({ onBack }: Props) {
  const [timeRange, setTimeRange] = useState('12M');
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
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
            <span className="text-[#0f172b] font-medium">Driver Fitness</span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[30px] font-semibold mb-3 text-[#0f172b]">Driver Fitness</h1>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1.5 bg-[#d1fae5] text-[#065f46] text-sm font-medium rounded-full">Within Threshold</span>
                <div className="flex items-center gap-2">
                  <span className="text-[24px] font-bold text-[#0f172b]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>38.0</span>
                  <span className="text-sm text-[#45556c]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>percentile</span>
                </div>
                <div className="w-px h-6 bg-[#cad5e2]" />
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#62748e]">Threshold:</span>
                  <span className="text-[#0f172b] font-medium">65.0</span>
                </div>
                <div className="flex items-center gap-1 text-[#10b981]">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-sm font-medium">-2.1%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium border border-[#e5e7eb] flex items-center gap-2 text-[#0f172b]">
                <FileText className="w-4 h-4" />View All Inspections
              </button>
              <button className="px-4 py-2 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium border border-[#e5e7eb] flex items-center gap-2 text-[#0f172b]">
                <Download className="w-4 h-4" />Export
              </button>
              <button className="px-4 py-2 bg-[#4f46e5] hover:bg-[#4338ca] rounded-lg text-sm font-medium text-white flex items-center gap-2 shadow-sm">
                <Target className="w-4 h-4" />Create Action Plan
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">

          {/* AI Safety Analysis */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#e5e7eb] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#ede9fe] rounded-lg">
                <Zap className="w-5 h-5 text-[#7c3aed]" />
              </div>
              <h2 className="text-lg font-semibold text-[#0f172b]">AI Safety Analysis</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#3b82f6] mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-[#0f172b] mb-2 text-sm">What This BASIC Measures</h3>
                  <p className="text-sm text-[#62748e] leading-relaxed">Driver Fitness compliance tracks driver qualification and eligibility violations including medical certificate validity, CDL compliance, license status, and driver qualification file completeness. High scores indicate weak expiration monitoring, incomplete documentation, or systemic qualification review gaps.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#f59e0b] mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-[#0f172b] mb-2 text-sm">Why This Score Matters</h3>
                  <p className="text-sm text-[#62748e] leading-relaxed">At 38.0 percentile, this carrier remains within threshold (65.0) but shows active qualification management risks. The -2.1% trend indicates improving compliance. However, 2 expired medical certificates and 3 incomplete qualification files create immediate exposure and require urgent remediation to prevent roadside violations.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-[#ef4444] mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-[#0f172b] mb-2 text-sm">Root Causes Detected</h3>
                  <ul className="text-sm text-[#62748e] leading-relaxed space-y-1.5">
                    {[
                      'Medical certificate violations represent 32% of total Driver Fitness exposure (18 occurrences)',
                      'Driver James Thompson shows repeat medical lapses (3rd occurrence in 18 months)',
                      '38% of issues stem from expiration tracking failures vs documentation gaps',
                      '5 drivers have medical certificates expiring within 30 days without documented renewal',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2"><span className="text-[#ef4444] mt-1">•</span><span>{item}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#10b981] mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-[#0f172b] mb-2 text-sm">Recommended Prevention Steps</h3>
                  <ol className="text-sm text-[#62748e] leading-relaxed space-y-1.5">
                    {[
                      'Immediate driver stand-down for Robert Martinez and James Thompson until medical certification resolved',
                      'Implement 60-day pre-expiration alerts with escalation workflow for medical certificates',
                      'Complete qualification file audits for 3 drivers with incomplete documentation',
                      'Establish monthly qualification review cycle with manager accountability',
                      'Deploy automated renewal outreach 90/60/30 days before credential expiration',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2"><span className="text-[#10b981] font-semibold">{i + 1}.</span><span>{item}</span></li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </motion.div>

          {/* KPI Strip */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <KPICard label="Percentile" value="38.0" trend="down" subtext="-2.1%" />
            <KPICard label="Threshold" value="65.0" />
            <KPICard label="30D Trend" value="-5%" trend="down" />
            <KPICard label="Inspections" value="128" />
            <KPICard label="Violations" value="56" />
            <KPICard label="Drivers" value="34" />
          </motion.div>

          {/* Trend + Breakdown */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-semibold mb-1 text-[#0f172b]">Driver Fitness Trend</h3>
                  <p className="text-sm text-[#62748e]">Qualification violations over time</p>
                </div>
                <div className="flex items-center gap-2">
                  {['30D', '90D', '6M', '12M'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${timeRange === range ? 'bg-[#4f46e5] text-white' : 'bg-[#f1f5f9] text-[#62748e] hover:bg-[#e2e8f0]'}`}
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

            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm">
              <h3 className="text-base font-semibold mb-4 text-[#0f172b]">Qualification Issues</h3>
              <div className="space-y-3">
                {issueBreakdown.map((item, idx) => (
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
                          className={`h-full ${item.urgency === 'critical' ? 'bg-[#dc2626]' : item.urgency === 'high' ? 'bg-[#f59e0b]' : 'bg-[#eab308]'}`}
                        />
                      </div>
                      <span className="text-xs text-[#94a3b8] w-8 text-right">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Driver Qualification Status Table */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#e5e7eb]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold mb-1 text-[#0f172b]">Driver Qualification Status</h3>
                  <p className="text-sm text-[#62748e]">Drivers requiring qualification review or remediation</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                    <input
                      type="text"
                      placeholder="Search drivers..."
                      className="pl-10 pr-4 py-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium border border-[#e5e7eb] flex items-center gap-2 text-[#0f172b]"
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
                    {['Driver Name', 'Last Event', 'Top Issue', 'Days Status', 'Risk', 'Status'].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">{h}</th>
                    ))}
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
                      <td className="px-6 py-4 text-sm text-[#62748e]">{driver.lastEvent}</td>
                      <td className="px-6 py-4 text-sm text-[#0f172b]">{driver.topIssue}</td>
                      <td className="px-6 py-4">
                        <span className={`font-mono text-sm font-semibold ${driver.daysStatus < 0 ? 'text-[#dc2626]' : driver.daysStatus < 30 ? 'text-[#f59e0b]' : 'text-[#94a3b8]'}`}>
                          {driver.daysStatus < 0 ? `${Math.abs(driver.daysStatus)}d ago` : driver.daysStatus === 0 ? 'N/A' : `${driver.daysStatus}d`}
                        </span>
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
                          driver.status === 'pending' ? 'bg-[#fee2e2] text-[#991b1b]' :
                          driver.status === 'in-review' ? 'bg-[#fef3c7] text-[#92400e]' :
                          'bg-[#d1fae5] text-[#065f46]'
                        }`}>
                          {driver.status === 'in-review' ? 'In Review' : driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Inspection History */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#e5e7eb]">
              <h3 className="text-base font-semibold mb-1 text-[#0f172b]">Driver Fitness Inspection History</h3>
              <p className="text-sm text-[#62748e]">Recent qualification-related violations and findings</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                  <tr>
                    {['Date', 'Location', 'Driver', 'Vehicle', 'Level', 'Violation', 'Category', 'Urgency', 'Status'].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-[#62748e] uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {inspectionHistory.map((inspection, idx) => (
                    <tr key={idx} className="hover:bg-[#f9fafb] transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-[#0f172b]">{inspection.date}</td>
                      <td className="px-6 py-4 text-sm text-[#62748e]">{inspection.state}</td>
                      <td className="px-6 py-4 text-sm text-[#0f172b]">{inspection.driver}</td>
                      <td className="px-6 py-4 text-sm font-mono text-[#0f172b]">{inspection.vehicle}</td>
                      <td className="px-6 py-4 text-sm text-[#62748e]">{inspection.level}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {inspection.violations.map((v, i) => (
                            <span key={i} className="px-2 py-0.5 bg-[#fee2e2] text-[#991b1b] text-xs rounded">{v}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-[#f1f5f9] text-[#0f172b] text-xs rounded font-medium">{inspection.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          inspection.urgency === 'critical' ? 'bg-[#fee2e2] text-[#991b1b]' :
                          inspection.urgency === 'high' ? 'bg-[#fef3c7] text-[#92400e]' :
                          'bg-[#fef9c3] text-[#854d0e]'
                        }`}>
                          {inspection.urgency.charAt(0).toUpperCase() + inspection.urgency.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {inspection.reviewed
                          ? <span className="px-2.5 py-1 bg-[#d1fae5] text-[#065f46] text-xs rounded-full font-semibold">Reviewed</span>
                          : <span className="px-2.5 py-1 bg-[#fef3c7] text-[#92400e] text-xs rounded-full font-semibold">Pending</span>}
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
                  <h3 className="text-base font-semibold text-[#0f172b]">Qualification Alerts</h3>
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
                          {alert.severity === 'critical'
                            ? <AlertOctagon className="w-4 h-4 text-[#dc2626]" />
                            : alert.severity === 'high'
                            ? <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
                            : <AlertCircle className="w-4 h-4 text-[#eab308]" />}
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
                <Target className="w-5 h-5 text-[#7c3aed]" />
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
