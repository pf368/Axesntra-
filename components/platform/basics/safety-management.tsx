'use client';

import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import type { BasicPageData } from '@/lib/basic-data-adapter';
import type { CarrierBrief } from '@/lib/types';

interface Props { basicData: BasicPageData; carrier: CarrierBrief; onBack: () => void; }

export function SafetyManagementPage({ onBack }: Props) {
  return (
    <div className="min-h-screen bg-[#f8fafc] overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-8 py-5">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-6">
              <div>
                <span className="text-sm text-gray-500 mr-3">DOT</span>
                <span className="text-2xl font-semibold">123456</span>
              </div>
              <div className="text-xl font-medium text-gray-900">Everyone Trucks LLC</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-8 py-6">

        {/* Key Status Cards */}
        <div className="grid grid-cols-3 gap-5 mb-6">
          {/* Insurance Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-blue-500">
                <path d="M10 2L3 5V9C3 13.5 6 17 10 18C14 17 17 13.5 17 9V5L10 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              <span className="font-semibold text-gray-900">Insurance Status</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-start">
                <span className="text-gray-500">BIPD Required</span>
                <span className="font-medium text-gray-900">$750,000</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-500">BIPD On File</span>
                <div className="text-right">
                  <div className="font-semibold text-green-600">$1,000,000</div>
                  <div className="text-xs text-gray-400 mt-0.5">Zurich American</div>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between items-start">
                  <span className="text-gray-500">Cargo Required</span>
                  <span className="font-medium text-gray-900">$5,000</span>
                </div>
                <div className="flex justify-between items-start mt-2">
                  <span className="text-gray-500">Cargo On File</span>
                  <span className="font-medium text-red-600">None</span>
                </div>
              </div>
            </div>
          </div>

          {/* MCS-150 Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-blue-500">
                <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M7 9L9 11L13 7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              <span className="font-semibold text-gray-900">MCS-150 Compliance</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-500" size={18} />
                <span className="text-green-600 font-medium">Current</span>
              </div>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Updated</span>
                  <span className="font-medium text-gray-900">March 15, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Next Due</span>
                  <span className="font-medium text-gray-900">March 15, 2027</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Updated By</span>
                  <span className="font-medium text-gray-900">Joe Smith</span>
                </div>
              </div>
            </div>
          </div>

          {/* Authority Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-blue-500">
                <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M10 6V10L13 12" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              <span className="font-semibold text-gray-900">Operating Authority</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Common</span>
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Contract</span>
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Broker</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full font-medium">None</span>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-500">Docket Number</span>
                  <span className="font-medium text-gray-900 font-mono text-xs">MC00379785</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Insurance Details */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <div className="font-semibold text-gray-900">Insurance Details</div>
            <div className="text-sm text-gray-500">Posted insurance filings from FMCSA</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left font-medium text-gray-600">Form</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-600">Type</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-600">Insurance Carrier</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-600">Policy/Surety</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-600">Posted Date</th>
                  <th className="px-5 py-3 text-right font-medium text-gray-600">Coverage From</th>
                  <th className="px-5 py-3 text-right font-medium text-gray-600">Coverage To</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-600">Effective Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium text-gray-900">91X</td>
                  <td className="px-5 py-4 text-gray-700">BIPD/Primary</td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-blue-600">Zurich American</div>
                    <div className="text-xs text-gray-500">Insurance Company</div>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-gray-700">BAP 4783714</td>
                  <td className="px-5 py-4 text-gray-700">06/16/2015</td>
                  <td className="px-5 py-4 text-right text-gray-700">$0</td>
                  <td className="px-5 py-4 text-right font-semibold text-gray-900">$1,000,000</td>
                  <td className="px-5 py-4 text-gray-700">03/01/2015</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Fleet & Registration Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
          <div className="mb-4">
            <div className="font-semibold text-gray-900">Fleet &amp; Registration Summary</div>
            <div className="text-sm text-gray-500">FMCSA provided legal details from MCS-150</div>
          </div>
          <div className="grid grid-cols-5 gap-4 mb-5 pb-5 border-b border-gray-200">
            {[
              { value: '902', label: 'Total Vehicles' },
              { value: '902', label: 'Power Units' },
              { value: '896', label: 'Total Drivers' },
              { value: '738', label: 'CDL Drivers' },
              { value: '13.7M', label: 'Miles Traveled' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-semibold text-gray-900 mb-0.5">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-x-8 gap-y-3 text-sm">
            {[
              { label: 'DOT Number', value: '123456' },
              { label: 'Legal Name', value: 'Everyone Trucks LLC' },
              { label: 'DBA', value: 'Everyone Trucks LLC' },
              { label: 'Representative', value: 'Mark Appleseed' },
              { label: 'Operation', value: 'Interstate Carrier' },
              { label: 'New Entrant', value: 'No' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Company Contact Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
          <div className="mb-4">
            <div className="font-semibold text-gray-900">Company Contact Info</div>
            <div className="text-sm text-gray-500">Registered contacts from the MCS-150</div>
          </div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-4 text-sm">
            {(['Primary Contact', 'Secondary Contact'] as const).map((heading) => (
              <div key={heading} className="space-y-2">
                <div className="font-medium text-gray-900 mb-3">{heading}</div>
                {[
                  { label: 'Name', value: 'Mark Appleseed' },
                  { label: 'Phone', value: '3145555555' },
                  { label: 'Cell Phone', value: '—', muted: true },
                  { label: 'Email', value: 'Justin.Appleseed@eeronetracks.COM', small: true },
                ].map(({ label, value, muted, small }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-500">{label}</span>
                    <span className={`font-medium ${muted ? 'text-gray-400' : 'text-gray-900'} ${small ? 'text-xs' : ''}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Operational Details */}
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="font-semibold text-gray-900 mb-3">Operational Classifications</div>
            <div className="inline-block px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm">
              Private Property
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="font-semibold text-gray-900 mb-3">Cargo Carried</div>
            <div className="flex flex-wrap gap-2">
              {['Grain, Feed, Hay', 'Chemicals', 'General Freight'].map(cargo => (
                <div key={cargo} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm">
                  {cargo}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
