'use client';

import { motion } from 'motion/react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import type { BasicPageData } from '@/lib/basic-data-adapter';
import type { CarrierBrief } from '@/lib/types';

interface Props {
  basicData: BasicPageData;
  carrier: CarrierBrief;
  onBack: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

const KPICard = ({ label, value, subtitle, status }: { label: string; value: string; subtitle?: string; status?: 'good' | 'warning' | 'critical' }) => {
  const statusColors = {
    good: '#10b981',
    warning: '#f59e0b',
    critical: '#ef4444'
  };

  return (
    <motion.div variants={itemVariants} className="bg-white rounded-lg border border-[#e5e7eb] p-4">
      <div className="text-xs text-[#62748e] mb-1 uppercase tracking-wide">{label}</div>
      <div className="text-2xl font-semibold text-[#0f172b] font-['JetBrains_Mono']" style={status ? { color: statusColors[status] } : {}}>
        {value}
      </div>
      {subtitle && <div className="text-xs text-[#62748e] mt-1">{subtitle}</div>}
    </motion.div>
  );
};

export function HazardousMaterialsPage({ onBack }: Props) {
  const [selectedInspection, setSelectedInspection] = useState<number | null>(null);
  const [trendView, setTrendView] = useState<'inspections' | 'violations' | 'oos'>('violations');

  const trendData = [
    { month: 'Apr 25', inspections: 3, violations: 5, oos: 1 },
    { month: 'May 25', inspections: 2, violations: 3, oos: 0 },
    { month: 'Jun 25', inspections: 1, violations: 1, oos: 0 },
    { month: 'Jul 25', inspections: 2, violations: 4, oos: 1 },
    { month: 'Aug 25', inspections: 3, violations: 6, oos: 2 },
    { month: 'Sep 25', inspections: 2, violations: 3, oos: 0 },
    { month: 'Oct 25', inspections: 1, violations: 2, oos: 0 },
    { month: 'Nov 25', inspections: 2, violations: 4, oos: 1 },
    { month: 'Dec 25', inspections: 1, violations: 1, oos: 0 },
    { month: 'Jan 26', inspections: 3, violations: 5, oos: 1 },
    { month: 'Feb 26', inspections: 2, violations: 4, oos: 1 },
    { month: 'Mar 26', inspections: 2, violations: 3, oos: 0 },
  ];

  const categoryData = [
    { category: 'Placarding / Marking', count: 12, share: 29, trend: 'up', color: '#ef4444' },
    { category: 'Shipping Papers', count: 10, share: 24, trend: 'stable', color: '#f59e0b' },
    { category: 'Package Integrity', count: 8, share: 19, trend: 'down', color: '#3b82f6' },
    { category: 'Loading / Handling', count: 6, share: 14, trend: 'stable', color: '#8b5cf6' },
    { category: 'Emergency Response Info', count: 4, share: 10, trend: 'up', color: '#10b981' },
    { category: 'Other HM Compliance', count: 2, share: 5, trend: 'down', color: '#62748e' },
  ];

  const inspectionHistory = [
    { id: 1, date: '2026-03-22', state: 'TX', level: 'Level 1', driver: 'Rodriguez, A.', vehicle: 'T-3142', code: '392.2-SLLS2', description: 'Shipping papers not accessible', category: 'Shipping Papers', oos: 'Yes', tag: 'OOS Event' },
    { id: 2, date: '2026-03-15', state: 'CA', level: 'Level 1', driver: 'Martinez, R.', vehicle: 'T-2847', code: '393.11', description: 'Placarding - Hazmat placard missing', category: 'Placarding / Marking', oos: 'No', tag: null },
    { id: 3, date: '2026-02-28', state: 'OH', level: 'Level 2', driver: 'Chen, W.', vehicle: 'T-1923', code: '177.817(a)', description: 'Package not secured against movement', category: 'Package Integrity', oos: 'No', tag: null },
    { id: 4, date: '2026-02-18', state: 'TX', level: 'Level 1', driver: 'Garcia, M.', vehicle: 'T-2156', code: '392.2-SLLS', description: 'Shipping papers - accessibility', category: 'Shipping Papers', oos: 'Yes', tag: 'Repeat State' },
    { id: 5, date: '2026-01-30', state: 'FL', level: 'Level 1', driver: 'Thompson, J.', vehicle: 'T-3041', code: '177.834(a)', description: 'Loading and securement - HM package', category: 'Loading / Handling', oos: 'No', tag: null },
    { id: 6, date: '2026-01-19', state: 'CA', level: 'Level 3', driver: 'Williams, D.', vehicle: 'T-2487', code: '177.817', description: 'Package integrity - damage noted', category: 'Package Integrity', oos: 'No', tag: null },
    { id: 7, date: '2025-11-25', state: 'TX', level: 'Level 1', driver: 'Johnson, K.', vehicle: 'T-1745', code: '393.11', description: 'Placarding - improper display', category: 'Placarding / Marking', oos: 'Yes', tag: 'OOS Event' },
    { id: 8, date: '2025-11-08', state: 'OH', level: 'Level 2', driver: 'Brown, T.', vehicle: 'T-2934', code: '392.2(a)', description: 'Emergency response information missing', category: 'Emergency Response Info', oos: 'No', tag: null },
    { id: 9, date: '2025-10-22', state: 'IL', level: 'Level 1', driver: 'Davis, P.', vehicle: 'T-1628', code: '393.11(a)', description: 'Placarding - required placard missing', category: 'Placarding / Marking', oos: 'No', tag: null },
    { id: 10, date: '2025-08-30', state: 'TX', level: 'Level 1', driver: 'Miller, S.', vehicle: 'T-2103', code: '177.817(b)', description: 'Package securement inadequate', category: 'Package Integrity', oos: 'Yes', tag: 'OOS Event' },
    { id: 11, date: '2025-08-15', state: 'CA', level: 'Level 2', driver: 'Anderson, L.', vehicle: 'T-1856', code: '392.2-SLLS', description: 'Shipping papers - not in proper form', category: 'Shipping Papers', oos: 'No', tag: null },
    { id: 12, date: '2025-07-28', state: 'FL', level: 'Level 1', driver: 'Wilson, M.', vehicle: 'T-2641', code: '177.834', description: 'Loading procedure violation', category: 'Loading / Handling', oos: 'No', tag: null },
  ];

  const statePatterns = [
    { state: 'TX', inspections: 4, violations: 7 },
    { state: 'CA', inspections: 3, violations: 5 },
    { state: 'OH', inspections: 2, violations: 3 },
    { state: 'FL', inspections: 2, violations: 3 },
    { state: 'IL', inspections: 1, violations: 2 },
  ];

  const driverPatterns = [
    { driver: 'Rodriguez, A.', inspections: 1, violations: 1, oos: 1 },
    { driver: 'Martinez, R.', inspections: 1, violations: 1, oos: 0 },
    { driver: 'Chen, W.', inspections: 1, violations: 1, oos: 0 },
    { driver: 'Garcia, M.', inspections: 1, violations: 1, oos: 1 },
  ];

  const vehiclePatterns = [
    { unit: 'T-3142', inspections: 1, violations: 1, oos: 1 },
    { unit: 'T-2847', inspections: 1, violations: 1, oos: 0 },
    { unit: 'T-1923', inspections: 1, violations: 1, oos: 0 },
    { unit: 'T-2156', inspections: 1, violations: 1, oos: 1 },
  ];

  const alerts = [
    { id: 1, date: '2026-03-22', title: 'OOS-Linked HM Event', description: 'Recent shipping papers violation resulted in OOS order', severity: 'critical' },
    { id: 2, date: '2026-03-18', title: 'Texas HM Concentration', description: 'TX accounts for 33% of all HM inspections in last 12 months', severity: 'warning' },
    { id: 3, date: '2026-03-10', title: 'Placarding Issues Increasing', description: 'Placarding violations represent 29% of total HM exposure', severity: 'warning' },
    { id: 4, date: '2026-02-28', title: 'Documentation Pattern', description: 'Shipping papers and placarding drive 53% of violations', severity: 'info' },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] p-8 overflow-y-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-[1600px] mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <button
            onClick={onBack}
            className="text-sm text-[#62748e] hover:text-[#0f172b] mb-2 flex items-center gap-1"
          >
            ← BASIC Detail
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-semibold text-[#0f172b]">Hazardous Materials Compliance</h1>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20">
                Elevated
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-['JetBrains_Mono'] font-semibold text-[#0f172b]">68.5</span>
                <span className="text-sm text-[#62748e]">percentile</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-[#e5e7eb] rounded-lg text-sm text-[#0f172b] hover:bg-[#f9fafb]">
                View All HM Inspections
              </button>
              <button className="px-4 py-2 bg-white border border-[#e5e7eb] rounded-lg text-sm text-[#0f172b] hover:bg-[#f9fafb]">
                Export
              </button>
              <button className="px-4 py-2 bg-[#0f172b] text-white rounded-lg text-sm hover:bg-[#1e293b]">
                Create Review List
              </button>
            </div>
          </div>
        </motion.div>

        {/* AI Safety Analysis */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg border border-[#e5e7eb] p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center text-white text-sm font-semibold">
              AI
            </div>
            <h2 className="text-lg font-semibold text-[#0f172b]">Safety Analysis</h2>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div className="border-r border-[#e5e7eb] pr-6">
              <h3 className="text-sm font-semibold text-[#0f172b] mb-2">What This BASIC Measures</h3>
              <p className="text-sm text-[#62748e] leading-relaxed">
                Hazardous Materials Compliance tracks roadside inspection violations related to the safe transportation of hazardous materials. The measure focuses on placarding, shipping papers, package integrity, loading/handling procedures, and emergency response information.
              </p>
            </div>

            <div className="border-r border-[#e5e7eb] pr-6">
              <h3 className="text-sm font-semibold text-[#0f172b] mb-2">Why This BASIC Matters</h3>
              <p className="text-sm text-[#62748e] leading-relaxed">
                HM violations represent public safety risk and regulatory exposure. Poor HM compliance can trigger intervention, increase insurance costs, limit shipper access, and escalate enforcement scrutiny. Managing HM exposure is essential for carriers authorized to transport hazmat.
              </p>
            </div>

            <div className="border-r border-[#e5e7eb] pr-6">
              <h3 className="text-sm font-semibold text-[#0f172b] mb-2">HM Inspection Patterns Detected</h3>
              <ul className="text-sm text-[#62748e] space-y-1">
                <li>• Placarding violations represent 29% of total exposure</li>
                <li>• Shipping papers issues account for 24% of violations</li>
                <li>• Texas concentration: 33% of all HM inspections</li>
                <li>• 5 OOS-linked HM events in last 12 months</li>
                <li>• Recent 90-day activity: 4 HM violations</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#0f172b] mb-2">Recommended Review Priorities</h3>
              <ul className="text-sm text-[#62748e] space-y-1">
                <li>• Review OOS-linked HM inspections first</li>
                <li>• Address placarding and documentation patterns</li>
                <li>• Examine Texas geographic concentration</li>
                <li>• Review driver/unit repeat patterns</li>
                <li>• Verify shipping papers accessibility procedures</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* KPI Strip */}
        <motion.div variants={itemVariants} className="grid grid-cols-6 gap-4 mb-6">
          <KPICard label="Percentile" value="68.5" status="warning" />
          <KPICard label="Threshold" value="80.0" subtitle="Intervention threshold" />
          <KPICard label="Trend (90D)" value="+5.8%" status="warning" />
          <KPICard label="Relevant HM Inspections" value="24" subtitle="Last 24 months" />
          <KPICard label="HM Violations" value="42" subtitle="Total violations" />
          <KPICard label="HM OOS Events" value="5" subtitle="12% of inspections" />
        </motion.div>

        {/* Secondary KPIs */}
        <motion.div variants={itemVariants} className="grid grid-cols-6 gap-4 mb-6">
          <KPICard label="Drivers Involved" value="12" />
          <KPICard label="Vehicles Involved" value="12" />
          <KPICard label="Most Recent HM" value="Mar 22" subtitle="2026" />
          <KPICard label="Repeat HM Events" value="3" subtitle="Same driver/unit" />
          <KPICard label="Top Category" value="Placarding" subtitle="29% of total" />
          <KPICard label="Documentation Issues" value="22" subtitle="53% of violations" />
        </motion.div>

        {/* Trend + Category Breakdown */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* HM Trend Chart */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg border border-[#e5e7eb] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-[#0f172b]">HM Activity Trend</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setTrendView('inspections')}
                  className={`px-3 py-1 rounded text-xs ${trendView === 'inspections' ? 'bg-[#0f172b] text-white' : 'bg-[#f9fafb] text-[#62748e]'}`}
                >
                  Inspections
                </button>
                <button
                  onClick={() => setTrendView('violations')}
                  className={`px-3 py-1 rounded text-xs ${trendView === 'violations' ? 'bg-[#0f172b] text-white' : 'bg-[#f9fafb] text-[#62748e]'}`}
                >
                  Violations
                </button>
                <button
                  onClick={() => setTrendView('oos')}
                  className={`px-3 py-1 rounded text-xs ${trendView === 'oos' ? 'bg-[#0f172b] text-white' : 'bg-[#f9fafb] text-[#62748e]'}`}
                >
                  OOS Events
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fill: '#62748e', fontSize: 11 }} />
                <YAxis tick={{ fill: '#62748e', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                {trendView === 'inspections' && <Line type="monotone" dataKey="inspections" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />}
                {trendView === 'violations' && <Line type="monotone" dataKey="violations" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} />}
                {trendView === 'oos' && <Line type="monotone" dataKey="oos" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} />}
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* HM Category Breakdown */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg border border-[#e5e7eb] p-6">
            <h3 className="text-base font-semibold text-[#0f172b] mb-4">HM Violation Breakdown</h3>
            <div className="space-y-3">
              {categoryData.map((cat) => (
                <div key={cat.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm font-medium text-[#0f172b]">{cat.category}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm font-['JetBrains_Mono'] font-semibold text-[#0f172b]">{cat.count}</div>
                      <div className="text-xs text-[#62748e]">violations</div>
                    </div>
                    <div className="text-right min-w-[50px]">
                      <div className="text-sm font-['JetBrains_Mono'] text-[#62748e]">{cat.share}%</div>
                    </div>
                    <div className="text-right min-w-[60px]">
                      <span className={`text-xs px-2 py-1 rounded ${
                        cat.trend === 'up' ? 'bg-[#ef4444]/10 text-[#ef4444]' :
                        cat.trend === 'down' ? 'bg-[#10b981]/10 text-[#10b981]' :
                        'bg-[#62748e]/10 text-[#62748e]'
                      }`}>
                        {cat.trend === 'up' ? '↑' : cat.trend === 'down' ? '↓' : '→'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* HM Inspection History Table */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg border border-[#e5e7eb] mb-6">
          <div className="p-6 border-b border-[#e5e7eb]">
            <h3 className="text-base font-semibold text-[#0f172b]">HM Inspection History</h3>
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                placeholder="Search inspections..."
                className="px-3 py-1.5 border border-[#e5e7eb] rounded text-sm flex-1"
              />
              <select className="px-3 py-1.5 border border-[#e5e7eb] rounded text-sm">
                <option>All Levels</option>
                <option>Level 1</option>
                <option>Level 2</option>
                <option>Level 3</option>
              </select>
              <select className="px-3 py-1.5 border border-[#e5e7eb] rounded text-sm">
                <option>All States</option>
                <option>TX</option>
                <option>CA</option>
                <option>OH</option>
              </select>
              <select className="px-3 py-1.5 border border-[#e5e7eb] rounded text-sm">
                <option>All Categories</option>
                <option>Placarding / Marking</option>
                <option>Shipping Papers</option>
                <option>Package Integrity</option>
              </select>
              <select className="px-3 py-1.5 border border-[#e5e7eb] rounded text-sm">
                <option>All OOS Status</option>
                <option>OOS Yes</option>
                <option>OOS No</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f9fafb] border-b border-[#e5e7eb] sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Inspection Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">State</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Level</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Driver</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Vehicle</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">OOS</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">AI Tag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb]">
                {inspectionHistory.map((inspection) => (
                  <tr
                    key={inspection.id}
                    onClick={() => setSelectedInspection(inspection.id)}
                    className="hover:bg-[#f9fafb] cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-['JetBrains_Mono'] text-[#0f172b]">{inspection.date}</td>
                    <td className="px-4 py-3 text-sm font-medium text-[#0f172b]">{inspection.state}</td>
                    <td className="px-4 py-3 text-sm text-[#62748e]">{inspection.level}</td>
                    <td className="px-4 py-3 text-sm text-[#0f172b]">{inspection.driver}</td>
                    <td className="px-4 py-3 text-sm font-['JetBrains_Mono'] text-[#0f172b]">{inspection.vehicle}</td>
                    <td className="px-4 py-3 text-sm font-['JetBrains_Mono'] text-[#62748e]">{inspection.code}</td>
                    <td className="px-4 py-3 text-sm text-[#62748e] max-w-[200px] truncate">{inspection.description}</td>
                    <td className="px-4 py-3 text-sm text-[#62748e]">{inspection.category}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        inspection.oos === 'Yes' ? 'bg-[#ef4444]/10 text-[#ef4444]' : 'bg-[#10b981]/10 text-[#10b981]'
                      }`}>
                        {inspection.oos}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {inspection.tag && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-[#8b5cf6]/10 text-[#8b5cf6]">
                          {inspection.tag}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Pattern Analysis */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* State Pattern */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg border border-[#e5e7eb] p-6">
            <h3 className="text-base font-semibold text-[#0f172b] mb-4">Top States by HM Activity</h3>
            <div className="space-y-3">
              {statePatterns.map((state) => (
                <div key={state.state} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#3b82f6]/10 flex items-center justify-center">
                      <span className="text-xs font-semibold text-[#3b82f6]">{state.state}</span>
                    </div>
                    <span className="text-sm font-medium text-[#0f172b]">{state.state}</span>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-right">
                      <div className="text-sm font-['JetBrains_Mono'] font-semibold text-[#0f172b]">{state.inspections}</div>
                      <div className="text-xs text-[#62748e]">inspections</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-['JetBrains_Mono'] font-semibold text-[#ef4444]">{state.violations}</div>
                      <div className="text-xs text-[#62748e]">violations</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Driver Pattern */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg border border-[#e5e7eb] p-6">
            <h3 className="text-base font-semibold text-[#0f172b] mb-4">Top Drivers by HM Inspections</h3>
            <div className="space-y-3">
              {driverPatterns.map((driver) => (
                <div key={driver.driver} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-[#0f172b]">{driver.driver}</div>
                    <div className="text-xs text-[#62748e]">{driver.violations} violations</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-right">
                      <div className="text-sm font-['JetBrains_Mono'] font-semibold text-[#0f172b]">{driver.inspections}</div>
                      <div className="text-xs text-[#62748e]">inspections</div>
                    </div>
                    {driver.oos > 0 && (
                      <div className="text-right">
                        <div className="text-sm font-['JetBrains_Mono'] font-semibold text-[#ef4444]">{driver.oos}</div>
                        <div className="text-xs text-[#62748e]">OOS</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Vehicle Pattern */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg border border-[#e5e7eb] p-6">
            <h3 className="text-base font-semibold text-[#0f172b] mb-4">Top Units by HM Inspections</h3>
            <div className="space-y-3">
              {vehiclePatterns.map((vehicle) => (
                <div key={vehicle.unit} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-['JetBrains_Mono'] font-medium text-[#0f172b]">{vehicle.unit}</div>
                    <div className="text-xs text-[#62748e]">{vehicle.violations} violations</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-right">
                      <div className="text-sm font-['JetBrains_Mono'] font-semibold text-[#0f172b]">{vehicle.inspections}</div>
                      <div className="text-xs text-[#62748e]">inspections</div>
                    </div>
                    {vehicle.oos > 0 && (
                      <div className="text-right">
                        <div className="text-sm font-['JetBrains_Mono'] font-semibold text-[#ef4444]">{vehicle.oos}</div>
                        <div className="text-xs text-[#62748e]">OOS</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Alerts + Action Center */}
        <div className="grid grid-cols-3 gap-6">
          {/* Alert Panel */}
          <motion.div variants={itemVariants} className="col-span-2 bg-white rounded-lg border border-[#e5e7eb] p-6">
            <h3 className="text-base font-semibold text-[#0f172b] mb-4">HM Intelligence Alerts</h3>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${
                    alert.severity === 'critical'
                      ? 'bg-[#ef4444]/5 border-[#ef4444]/20'
                      : alert.severity === 'warning'
                      ? 'bg-[#f59e0b]/5 border-[#f59e0b]/20'
                      : 'bg-[#3b82f6]/5 border-[#3b82f6]/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-semibold text-[#0f172b] mb-1">{alert.title}</div>
                      <div className="text-sm text-[#62748e]">{alert.description}</div>
                    </div>
                    <div className="text-xs text-[#62748e] whitespace-nowrap ml-4">{alert.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Center */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg border border-[#e5e7eb] p-6">
            <h3 className="text-base font-semibold text-[#0f172b] mb-4">Action Center</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-[#0f172b] text-white rounded-lg text-sm hover:bg-[#1e293b] text-left">
                Review OOS-Linked HM Events
              </button>
              <button className="w-full px-4 py-2 bg-white border border-[#e5e7eb] rounded-lg text-sm text-[#0f172b] hover:bg-[#f9fafb] text-left">
                Review Placarding Violations
              </button>
              <button className="w-full px-4 py-2 bg-white border border-[#e5e7eb] rounded-lg text-sm text-[#0f172b] hover:bg-[#f9fafb] text-left">
                Review Shipping Papers Issues
              </button>
              <button className="w-full px-4 py-2 bg-white border border-[#e5e7eb] rounded-lg text-sm text-[#0f172b] hover:bg-[#f9fafb] text-left">
                Examine Texas Concentration
              </button>
              <button className="w-full px-4 py-2 bg-white border border-[#e5e7eb] rounded-lg text-sm text-[#0f172b] hover:bg-[#f9fafb] text-left">
                Export HM Violation History
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Detail Drawer */}
      {selectedInspection && (
        <div
          className="fixed inset-0 bg-black/20 z-50"
          onClick={() => setSelectedInspection(null)}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-[500px] bg-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#0f172b]">HM Inspection Details</h2>
                <button
                  onClick={() => setSelectedInspection(null)}
                  className="text-[#62748e] hover:text-[#0f172b]"
                >
                  ✕
                </button>
              </div>

              {(() => {
                const inspection = inspectionHistory.find((i) => i.id === selectedInspection);
                if (!inspection) return null;

                return (
                  <div className="space-y-6">
                    <div>
                      <div className="text-xs text-[#62748e] mb-1 uppercase tracking-wide">Inspection Date</div>
                      <div className="text-base font-['JetBrains_Mono'] text-[#0f172b]">{inspection.date}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-[#62748e] mb-1 uppercase tracking-wide">State</div>
                        <div className="text-base text-[#0f172b]">{inspection.state}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#62748e] mb-1 uppercase tracking-wide">Level</div>
                        <div className="text-base text-[#0f172b]">{inspection.level}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-[#62748e] mb-1 uppercase tracking-wide">Driver</div>
                        <div className="text-base text-[#0f172b]">{inspection.driver}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#62748e] mb-1 uppercase tracking-wide">Vehicle</div>
                        <div className="text-base font-['JetBrains_Mono'] text-[#0f172b]">{inspection.vehicle}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-[#62748e] mb-1 uppercase tracking-wide">Violation Code</div>
                      <div className="text-base font-['JetBrains_Mono'] text-[#0f172b]">{inspection.code}</div>
                    </div>

                    <div>
                      <div className="text-xs text-[#62748e] mb-1 uppercase tracking-wide">Description</div>
                      <div className="text-base text-[#0f172b]">{inspection.description}</div>
                    </div>

                    <div>
                      <div className="text-xs text-[#62748e] mb-1 uppercase tracking-wide">HM Category</div>
                      <div className="text-base text-[#0f172b]">{inspection.category}</div>
                    </div>

                    <div>
                      <div className="text-xs text-[#62748e] mb-1 uppercase tracking-wide">OOS Status</div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        inspection.oos === 'Yes' ? 'bg-[#ef4444]/10 text-[#ef4444]' : 'bg-[#10b981]/10 text-[#10b981]'
                      }`}>
                        {inspection.oos}
                      </span>
                    </div>

                    {inspection.tag && (
                      <div>
                        <div className="text-xs text-[#62748e] mb-1 uppercase tracking-wide">AI Tag</div>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-[#8b5cf6]/10 text-[#8b5cf6]">
                          {inspection.tag}
                        </span>
                      </div>
                    )}

                    <div className="pt-4 border-t border-[#e5e7eb]">
                      <h3 className="text-sm font-semibold text-[#0f172b] mb-3">Actions</h3>
                      <div className="space-y-2">
                        <button className="w-full px-4 py-2 bg-[#0f172b] text-white rounded-lg text-sm hover:bg-[#1e293b] text-left">
                          Mark Reviewed
                        </button>
                        <button className="w-full px-4 py-2 bg-white border border-[#e5e7eb] rounded-lg text-sm text-[#0f172b] hover:bg-[#f9fafb] text-left">
                          Add Note
                        </button>
                        <button className="w-full px-4 py-2 bg-white border border-[#e5e7eb] rounded-lg text-sm text-[#0f172b] hover:bg-[#f9fafb] text-left">
                          Assign Follow-Up
                        </button>
                        <button className="w-full px-4 py-2 bg-white border border-[#e5e7eb] rounded-lg text-sm text-[#0f172b] hover:bg-[#f9fafb] text-left">
                          Export Inspection
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
