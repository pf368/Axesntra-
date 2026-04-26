'use client';

import { motion } from 'motion/react';
import { LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import type { BasicPageData } from '@/lib/basic-data-adapter';
import type { CarrierBrief } from '@/lib/types';

interface CrashIndicatorPageProps {
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

export function CrashIndicatorPage({ onBack }: CrashIndicatorPageProps) {
  const [selectedCrash, setSelectedCrash] = useState<number | null>(null);
  const [crashFilter, setCrashFilter] = useState<'all' | 'sms' | 'reviewed'>('all');

  const trendData = [
    { month: 'Apr 25', all: 2, sms: 2, reviewed: 0 },
    { month: 'May 25', all: 1, sms: 1, reviewed: 0 },
    { month: 'Jun 25', all: 0, sms: 0, reviewed: 0 },
    { month: 'Jul 25', all: 1, sms: 1, reviewed: 0 },
    { month: 'Aug 25', all: 3, sms: 2, reviewed: 1 },
    { month: 'Sep 25', all: 2, sms: 2, reviewed: 0 },
    { month: 'Oct 25', all: 1, sms: 0, reviewed: 1 },
    { month: 'Nov 25', all: 2, sms: 1, reviewed: 1 },
    { month: 'Dec 25', all: 0, sms: 0, reviewed: 0 },
    { month: 'Jan 26', all: 1, sms: 1, reviewed: 0 },
    { month: 'Feb 26', all: 2, sms: 2, reviewed: 0 },
    { month: 'Mar 26', all: 1, sms: 1, reviewed: 0 },
  ];

  const severityData = [
    { type: 'Fatal', count: 0, sms: 0, reviewed: 0, color: '#dc2626' },
    { type: 'Injury', count: 7, sms: 5, reviewed: 2, color: '#f59e0b' },
    { type: 'Tow-Away', count: 9, sms: 8, reviewed: 1, color: '#3b82f6' },
  ];

  const geographicData = [
    { state: 'TX', count: 5 },
    { state: 'CA', count: 4 },
    { state: 'FL', count: 3 },
    { state: 'OH', count: 2 },
    { state: 'IL', count: 2 },
  ];

  const crashHistory = [
    { id: 1, date: '2026-03-18', state: 'TX', driver: 'Garcia, M.', vehicle: 'T-2487', type: 'Rear-End', severity: 'Injury', sms: 'Included in SMS', review: 'Under Review', tag: 'Repeat Driver' },
    { id: 2, date: '2026-02-22', state: 'CA', driver: 'Thompson, J.', vehicle: 'T-1923', type: 'Lane Change', severity: 'Tow-Away', sms: 'Included in SMS', review: 'Reviewed', tag: null },
    { id: 3, date: '2026-02-15', state: 'FL', driver: 'Martinez, R.', vehicle: 'T-3041', type: 'Fixed Object', severity: 'Tow-Away', sms: 'Included in SMS', review: 'Reviewed', tag: null },
    { id: 4, date: '2026-01-29', state: 'TX', driver: 'Chen, W.', vehicle: 'T-2156', type: 'Intersection', severity: 'Injury', sms: 'Included in SMS', review: 'Reviewed', tag: null },
    { id: 5, date: '2025-11-08', state: 'OH', driver: 'Garcia, M.', vehicle: 'T-2487', type: 'Following Too Close', severity: 'Tow-Away', sms: 'Reviewed - Not Preventable', review: 'Reviewed', tag: 'Repeat Driver' },
    { id: 6, date: '2025-10-19', state: 'CA', driver: 'Williams, D.', vehicle: 'T-1809', type: 'Lane Change', severity: 'Tow-Away', sms: 'Reviewed - Not Preventable', review: 'Reviewed', tag: null },
    { id: 7, date: '2025-09-27', state: 'TX', driver: 'Rodriguez, A.', vehicle: 'T-2641', type: 'Intersection', severity: 'Injury', sms: 'Included in SMS', review: 'Reviewed', tag: 'High Severity' },
    { id: 8, date: '2025-09-14', state: 'FL', driver: 'Johnson, K.', vehicle: 'T-1745', type: 'Rear-End', severity: 'Injury', sms: 'Included in SMS', review: 'Reviewed', tag: null },
    { id: 9, date: '2025-08-30', state: 'CA', driver: 'Brown, T.', vehicle: 'T-2934', type: 'Fixed Object', severity: 'Injury', sms: 'Included in SMS', review: 'Reviewed', tag: null },
    { id: 10, date: '2025-08-12', state: 'IL', driver: 'Davis, P.', vehicle: 'T-1628', type: 'Lane Change', severity: 'Tow-Away', sms: 'Included in SMS', review: 'Reviewed', tag: null },
    { id: 11, date: '2025-08-05', state: 'TX', driver: 'Miller, S.', vehicle: 'T-2103', type: 'Intersection', severity: 'Tow-Away', sms: 'Reviewed - Not Preventable', review: 'Reviewed', tag: null },
    { id: 12, date: '2025-07-22', state: 'OH', driver: 'Anderson, L.', vehicle: 'T-1856', type: 'Fixed Object', severity: 'Tow-Away', sms: 'Included in SMS', review: 'Reviewed', tag: null },
  ];

  const driverPatterns = [
    { driver: 'Garcia, M.', crashes: 2, severity: 'Mixed', mostRecent: '2026-03-18' },
    { driver: 'Thompson, J.', crashes: 1, severity: 'Tow-Away', mostRecent: '2026-02-22' },
    { driver: 'Martinez, R.', crashes: 1, severity: 'Tow-Away', mostRecent: '2026-02-15' },
    { driver: 'Chen, W.', crashes: 1, severity: 'Injury', mostRecent: '2026-01-29' },
  ];

  const vehiclePatterns = [
    { unit: 'T-2487', crashes: 2, driver: 'Garcia, M.', mostRecent: '2026-03-18' },
    { unit: 'T-1923', crashes: 1, driver: 'Thompson, J.', mostRecent: '2026-02-22' },
    { unit: 'T-3041', crashes: 1, driver: 'Martinez, R.', mostRecent: '2026-02-15' },
    { unit: 'T-2156', crashes: 1, driver: 'Chen, W.', mostRecent: '2026-01-29' },
  ];

  const alerts = [
    { id: 1, date: '2026-03-18', title: 'Repeat Driver Pattern Detected', description: 'Garcia, M. involved in 2 crashes within 6 months', severity: 'warning' },
    { id: 2, date: '2026-03-10', title: 'Texas Crash Concentration', description: 'TX accounts for 31% of all crashes in the last 12 months', severity: 'info' },
    { id: 3, date: '2026-02-28', title: 'Injury Crash Increase', description: 'Injury crashes represent 44% of total exposure', severity: 'warning' },
    { id: 4, date: '2026-02-15', title: 'Recent Activity Cluster', description: '3 crashes recorded in the last 30 days', severity: 'critical' },
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
              <h1 className="text-3xl font-semibold text-[#0f172b]">Crash Indicator</h1>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20">
                Within Threshold
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-['JetBrains_Mono'] font-semibold text-[#0f172b]">45.2</span>
                <span className="text-sm text-[#62748e]">percentile</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-[#e5e7eb] rounded-lg text-sm text-[#0f172b] hover:bg-[#f9fafb]">
                View All Crashes
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
                Crash Indicator tracks reportable crashes involving commercial motor vehicles. The measure considers crash frequency, severity mix (fatal, injury, tow-away), and recency. Crashes are weighted by severity, with fatal crashes weighted most heavily.
              </p>
            </div>

            <div className="border-r border-[#e5e7eb] pr-6">
              <h3 className="text-sm font-semibold text-[#0f172b] mb-2">Why This BASIC Matters</h3>
              <p className="text-sm text-[#62748e] leading-relaxed">
                Crash history is the most direct measure of fleet safety exposure. A carrier&apos;s crash profile drives intervention priority, insurance underwriting, shipper scrutiny, and enforcement attention. Managing crash exposure is critical to operational continuity.
              </p>
            </div>

            <div className="border-r border-[#e5e7eb] pr-6">
              <h3 className="text-sm font-semibold text-[#0f172b] mb-2">Crash Patterns Detected</h3>
              <ul className="text-sm text-[#62748e] space-y-1">
                <li>• Injury crashes represent 44% of total exposure</li>
                <li>• Texas accounts for 31% of all crashes</li>
                <li>• One driver involved in 2 crashes within 6 months</li>
                <li>• 3 crashes marked reviewed-not-preventable (19%)</li>
                <li>• Recent 90-day activity: 3 crashes</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#0f172b] mb-2">Recommended Review Priorities</h3>
              <ul className="text-sm text-[#62748e] space-y-1">
                <li>• Review repeat-driver crash pattern (Garcia, M.)</li>
                <li>• Examine Texas geographic concentration</li>
                <li>• Analyze injury crash severity trend</li>
                <li>• Review recent 30-day cluster activity</li>
                <li>• Verify reviewed-not-preventable status</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* KPI Strip */}
        <motion.div variants={itemVariants} className="grid grid-cols-6 gap-4 mb-6">
          <KPICard label="Percentile" value="45.2" status="good" />
          <KPICard label="Threshold" value="65.0" subtitle="National average" />
          <KPICard label="Trend (90D)" value="+2.3%" status="warning" />
          <KPICard label="Total Reportable" value="16" subtitle="Last 24 months" />
          <KPICard label="SMS Included" value="13" subtitle="81% of total" />
          <KPICard label="Reviewed - Not Preventable" value="3" subtitle="19% of total" />
        </motion.div>

        {/* Secondary KPIs */}
        <motion.div variants={itemVariants} className="grid grid-cols-6 gap-4 mb-6">
          <KPICard label="Fatal Crashes" value="0" status="good" />
          <KPICard label="Injury Crashes" value="7" subtitle="44% of total" />
          <KPICard label="Tow-Away Crashes" value="9" subtitle="56% of total" />
          <KPICard label="Drivers Involved" value="12" />
          <KPICard label="Vehicles Involved" value="12" />
          <KPICard label="Most Recent" value="Mar 18" subtitle="2026" />
        </motion.div>

        {/* Trend + Severity Section */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Crash Trend Chart */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg border border-[#e5e7eb] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-[#0f172b]">Crash Activity Trend</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setCrashFilter('all')}
                  className={`px-3 py-1 rounded text-xs ${crashFilter === 'all' ? 'bg-[#0f172b] text-white' : 'bg-[#f9fafb] text-[#62748e]'}`}
                >
                  All Listed
                </button>
                <button
                  onClick={() => setCrashFilter('sms')}
                  className={`px-3 py-1 rounded text-xs ${crashFilter === 'sms' ? 'bg-[#0f172b] text-white' : 'bg-[#f9fafb] text-[#62748e]'}`}
                >
                  SMS Included
                </button>
                <button
                  onClick={() => setCrashFilter('reviewed')}
                  className={`px-3 py-1 rounded text-xs ${crashFilter === 'reviewed' ? 'bg-[#0f172b] text-white' : 'bg-[#f9fafb] text-[#62748e]'}`}
                >
                  Reviewed-Not-Preventable
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fill: '#62748e', fontSize: 11 }} />
                <YAxis tick={{ fill: '#62748e', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                {crashFilter === 'all' && <Line type="monotone" dataKey="all" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />}
                {crashFilter === 'sms' && <Line type="monotone" dataKey="sms" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} />}
                {crashFilter === 'reviewed' && <Line type="monotone" dataKey="reviewed" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />}
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Severity Breakdown */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg border border-[#e5e7eb] p-6">
            <h3 className="text-base font-semibold text-[#0f172b] mb-4">Crash Severity Breakdown</h3>
            <div className="space-y-4">
              {severityData.map((severity) => (
                <div key={severity.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: severity.color }} />
                    <span className="text-sm font-medium text-[#0f172b]">{severity.type}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm font-['JetBrains_Mono'] font-semibold text-[#0f172b]">{severity.count}</div>
                      <div className="text-xs text-[#62748e]">Total</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-['JetBrains_Mono'] font-semibold text-[#ef4444]">{severity.sms}</div>
                      <div className="text-xs text-[#62748e]">SMS</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-['JetBrains_Mono'] font-semibold text-[#10b981]">{severity.reviewed}</div>
                      <div className="text-xs text-[#62748e]">Reviewed-NP</div>
                    </div>
                    <div className="text-right min-w-[60px]">
                      <div className="text-sm font-['JetBrains_Mono'] text-[#62748e]">
                        {severity.count > 0 ? Math.round((severity.count / 16) * 100) : 0}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Crash History Table */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg border border-[#e5e7eb] mb-6">
          <div className="p-6 border-b border-[#e5e7eb]">
            <h3 className="text-base font-semibold text-[#0f172b]">Crash History</h3>
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                placeholder="Search crashes..."
                className="px-3 py-1.5 border border-[#e5e7eb] rounded text-sm flex-1"
              />
              <select className="px-3 py-1.5 border border-[#e5e7eb] rounded text-sm">
                <option>All Severities</option>
                <option>Injury Only</option>
                <option>Tow-Away Only</option>
              </select>
              <select className="px-3 py-1.5 border border-[#e5e7eb] rounded text-sm">
                <option>All States</option>
                <option>TX</option>
                <option>CA</option>
                <option>FL</option>
              </select>
              <select className="px-3 py-1.5 border border-[#e5e7eb] rounded text-sm">
                <option>All Status</option>
                <option>SMS Included Only</option>
                <option>Reviewed-Not-Preventable Only</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f9fafb] border-b border-[#e5e7eb] sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Crash Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">State</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Driver</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Vehicle</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Crash Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Severity</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">SMS Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">Review</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#62748e] uppercase tracking-wider">AI Tag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb]">
                {crashHistory.map((crash) => (
                  <tr
                    key={crash.id}
                    onClick={() => setSelectedCrash(crash.id)}
                    className="hover:bg-[#f9fafb] cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-['JetBrains_Mono'] text-[#0f172b]">{crash.date}</td>
                    <td className="px-4 py-3 text-sm font-medium text-[#0f172b]">{crash.state}</td>
                    <td className="px-4 py-3 text-sm text-[#0f172b]">{crash.driver}</td>
                    <td className="px-4 py-3 text-sm font-['JetBrains_Mono'] text-[#0f172b]">{crash.vehicle}</td>
                    <td className="px-4 py-3 text-sm text-[#62748e]">{crash.type}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        crash.severity === 'Injury' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' : 'bg-[#3b82f6]/10 text-[#3b82f6]'
                      }`}>
                        {crash.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        crash.sms === 'Included in SMS' ? 'bg-[#ef4444]/10 text-[#ef4444]' : 'bg-[#10b981]/10 text-[#10b981]'
                      }`}>
                        {crash.sms}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#62748e]">{crash.review}</td>
                    <td className="px-4 py-3">
                      {crash.tag && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-[#8b5cf6]/10 text-[#8b5cf6]">
                          {crash.tag}
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
          {/* Geographic Pattern */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg border border-[#e5e7eb] p-6">
            <h3 className="text-base font-semibold text-[#0f172b] mb-4">Geographic Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={geographicData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="state" tick={{ fill: '#62748e', fontSize: 11 }} />
                <YAxis tick={{ fill: '#62748e', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Driver Pattern */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg border border-[#e5e7eb] p-6">
            <h3 className="text-base font-semibold text-[#0f172b] mb-4">Top Drivers by Crash Count</h3>
            <div className="space-y-3">
              {driverPatterns.map((driver) => (
                <div key={driver.driver} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-[#0f172b]">{driver.driver}</div>
                    <div className="text-xs text-[#62748e]">{driver.severity}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-['JetBrains_Mono'] font-semibold text-[#0f172b]">{driver.crashes}</div>
                    <div className="text-xs text-[#62748e]">crashes</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Vehicle Pattern */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg border border-[#e5e7eb] p-6">
            <h3 className="text-base font-semibold text-[#0f172b] mb-4">Top Units by Crash Count</h3>
            <div className="space-y-3">
              {vehiclePatterns.map((vehicle) => (
                <div key={vehicle.unit} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-['JetBrains_Mono'] font-medium text-[#0f172b]">{vehicle.unit}</div>
                    <div className="text-xs text-[#62748e]">{vehicle.driver}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-['JetBrains_Mono'] font-semibold text-[#0f172b]">{vehicle.crashes}</div>
                    <div className="text-xs text-[#62748e]">crashes</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Reviewed-Not-Preventable Module */}
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-[#10b981]/5 to-[#3b82f6]/5 rounded-lg border border-[#10b981]/20 p-6 mb-6">
          <h3 className="text-base font-semibold text-[#0f172b] mb-4">Reviewed-Not-Preventable Status</h3>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <div className="text-xs text-[#62748e] mb-1 uppercase tracking-wide">Total Listed</div>
              <div className="text-2xl font-['JetBrains_Mono'] font-semibold text-[#0f172b]">16</div>
            </div>
            <div>
              <div className="text-xs text-[#62748e] mb-1 uppercase tracking-wide">Included in SMS</div>
              <div className="text-2xl font-['JetBrains_Mono'] font-semibold text-[#ef4444]">13</div>
              <div className="text-xs text-[#62748e] mt-1">81% of listed</div>
            </div>
            <div>
              <div className="text-xs text-[#62748e] mb-1 uppercase tracking-wide">Reviewed-Not-Preventable</div>
              <div className="text-2xl font-['JetBrains_Mono'] font-semibold text-[#10b981]">3</div>
              <div className="text-xs text-[#62748e] mt-1">19% of listed</div>
            </div>
            <div>
              <div className="text-xs text-[#62748e] mb-1 uppercase tracking-wide">Most Recent RNP</div>
              <div className="text-base font-['JetBrains_Mono'] font-semibold text-[#0f172b]">Nov 8, 2025</div>
              <div className="text-xs text-[#62748e] mt-1">Following Too Close</div>
            </div>
          </div>
        </motion.div>

        {/* Alerts + Action Center */}
        <div className="grid grid-cols-3 gap-6">
          {/* Alert Panel */}
          <motion.div variants={itemVariants} className="col-span-2 bg-white rounded-lg border border-[#e5e7eb] p-6">
            <h3 className="text-base font-semibold text-[#0f172b] mb-4">Crash Intelligence Alerts</h3>
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
                Review Repeat-Driver Pattern
              </button>
              <button className="w-full px-4 py-2 bg-white border border-[#e5e7eb] rounded-lg text-sm text-[#0f172b] hover:bg-[#f9fafb] text-left">
                Review Injury Crashes
              </button>
              <button className="w-full px-4 py-2 bg-white border border-[#e5e7eb] rounded-lg text-sm text-[#0f172b] hover:bg-[#f9fafb] text-left">
                Examine Texas Concentration
              </button>
              <button className="w-full px-4 py-2 bg-white border border-[#e5e7eb] rounded-lg text-sm text-[#0f172b] hover:bg-[#f9fafb] text-left">
                Export Crash History
              </button>
              <button className="w-full px-4 py-2 bg-white border border-[#e5e7eb] rounded-lg text-sm text-[#0f172b] hover:bg-[#f9fafb] text-left">
                Review RNP Status
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Detail Drawer */}
      {selectedCrash && (
        <div
          className="fixed inset-0 bg-black/20 z-50"
          onClick={() => setSelectedCrash(null)}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-[500px] bg-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#0f172b]">Crash Details</h2>
                <button
                  onClick={() => setSelectedCrash(null)}
                  className="text-[#62748e] hover:text-[#0f172b]"
                >
                  ✕
                </button>
              </div>

              {(() => {
                const crash = crashHistory.find((c) => c.id === selectedCrash);
                if (!crash) return null;

                return (
                  <div className="space-y-6">
                    <div>
                      <div className="text-xs text-[#62748e] mb-1 uppercase tracking-wide">Crash Date</div>
                      <div className="text-base font-['JetBrains_Mono'] text-[#0f172b]">{crash.date}</div>
                    </div>

                    <div>
                      <div className="text-xs text-[#62748e] mb-1 uppercase tracking-wide">Location</div>
                      <div className="text-base text-[#0f172b]">{crash.state}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-[#62748e] mb-1 uppercase tracking-wide">Driver</div>
                        <div className="text-base text-[#0f172b]">{crash.driver}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#62748e] mb-1 uppercase tracking-wide">Vehicle</div>
                        <div className="text-base font-['JetBrains_Mono'] text-[#0f172b]">{crash.vehicle}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-[#62748e] mb-1 uppercase tracking-wide">Crash Type</div>
                      <div className="text-base text-[#0f172b]">{crash.type}</div>
                    </div>

                    <div>
                      <div className="text-xs text-[#62748e] mb-1 uppercase tracking-wide">Severity</div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        crash.severity === 'Injury' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' : 'bg-[#3b82f6]/10 text-[#3b82f6]'
                      }`}>
                        {crash.severity}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs text-[#62748e] mb-1 uppercase tracking-wide">SMS Status</div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        crash.sms === 'Included in SMS' ? 'bg-[#ef4444]/10 text-[#ef4444]' : 'bg-[#10b981]/10 text-[#10b981]'
                      }`}>
                        {crash.sms}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs text-[#62748e] mb-1 uppercase tracking-wide">Review Status</div>
                      <div className="text-base text-[#0f172b]">{crash.review}</div>
                    </div>

                    {crash.tag && (
                      <div>
                        <div className="text-xs text-[#62748e] mb-1 uppercase tracking-wide">AI Tag</div>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-[#8b5cf6]/10 text-[#8b5cf6]">
                          {crash.tag}
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
                          Export Record
                        </button>
                        <button className="w-full px-4 py-2 bg-white border border-[#e5e7eb] rounded-lg text-sm text-[#0f172b] hover:bg-[#f9fafb] text-left">
                          Open Review Workflow
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
