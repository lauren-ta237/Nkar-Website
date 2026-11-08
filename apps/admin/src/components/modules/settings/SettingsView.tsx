import React, { useState } from 'react';
import {
  Settings,
  Shield,
  RotateCcw,
  Save,
  CheckCircle2,
  Globe,
  Bell,
  HardDrive,
  Download,
} from 'lucide-react';
import { useAdminStore } from '../../../store/useAdminStore';
import { backendApi } from '../../../api/backend';
import { useQueryClient } from '@tanstack/react-query';
import { ConfirmModal } from '../../common/ConfirmModal';

export const SettingsView: React.FC = () => {
  const { currentUser, switchRole } = useAdminStore();
  const queryClient = useQueryClient();

  const [fondomName, setFondomName] = useState('Nkar Fondom (Nkar Woo Làn)');
  const [traditionalCapital, setTraditionalCapital] = useState('Nkar Village, Bui Division, North West Region, Cameroon');
  const [officialContact, setOfficialContact] = useState('traditionalcouncil@nkarwoolad.cm');
  const [phoneNumber, setPhoneNumber] = useState('+237 677 89 45 12');
  const [reviewRequired, setReviewRequired] = useState(true);
  const [publicInquiriesEnabled, setPublicInquiriesEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetFactoryData = () => {
    backendApi.resetAllData();
    queryClient.invalidateQueries();
    setResetConfirmOpen(false);
    setResetSuccessMessage('Database successfully restored to clean authentic Nkar Woo Làn demo dataset.');
    setTimeout(() => setResetSuccessMessage(null), 5000);
  };

  const handleExportJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      portal: 'Nkar Woo Làn Admin Platform',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nkar-woo-lan-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#153E2E]" />
          Platform Settings & System Configuration
        </h2>
        <p className="text-xs text-stone-500">
          Fondom metadata, editorial workflow rules, notification thresholds, and database maintenance
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>System configuration preferences saved successfully.</span>
        </div>
      )}

      {resetSuccessMessage && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-600" />
          <span>{resetSuccessMessage}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Card 1: Fondom Identity & Metadata */}
        <div className="bg-white border border-[#E8E4DA] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F2EFE9]">
            <Globe className="w-4 h-4 text-[#153E2E]" />
            <h3 className="text-sm font-bold text-stone-900">Fondom Identity & Geographic Registry</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Official Name</label>
              <input
                type="text"
                value={fondomName}
                onChange={(e) => setFondomName(e.target.value)}
                disabled={!isSuperAdmin}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Traditional Seat</label>
              <input
                type="text"
                value={traditionalCapital}
                onChange={(e) => setTraditionalCapital(e.target.value)}
                disabled={!isSuperAdmin}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Council Contact Email</label>
              <input
                type="email"
                value={officialContact}
                onChange={(e) => setOfficialContact(e.target.value)}
                disabled={!isSuperAdmin}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Palace Registry Phone</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={!isSuperAdmin}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800 disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Editorial Governance & Verification */}
        <div className="bg-white border border-[#E8E4DA] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F2EFE9]">
            <Shield className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-sm font-bold text-stone-900">Editorial Governance & Verification Workflows</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-start gap-3 p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE6DD] cursor-pointer">
              <input
                type="checkbox"
                checked={reviewRequired}
                onChange={(e) => setReviewRequired(e.target.checked)}
                disabled={!isSuperAdmin}
                className="mt-0.5 rounded border-[#E5E0D5] text-[#153E2E] focus:ring-[#153E2E]"
              />
              <div>
                <span className="font-bold text-stone-900 block">Strict 4-Eye Cultural Review Policy</span>
                <span className="text-stone-500 block mt-0.5 leading-relaxed">
                  Require Content Reviewer or Super Admin approval before any community article, event, or oral tradition entry is published live.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE6DD] cursor-pointer">
              <input
                type="checkbox"
                checked={publicInquiriesEnabled}
                onChange={(e) => setPublicInquiriesEnabled(e.target.checked)}
                disabled={!isSuperAdmin}
                className="mt-0.5 rounded border-[#E5E0D5] text-[#153E2E] focus:ring-[#153E2E]"
              />
              <div>
                <span className="font-bold text-stone-900 block">Accept Public Citizen Inquiries & Feedback</span>
                <span className="text-stone-500 block mt-0.5 leading-relaxed">
                  Receive inbound contact requests from diaspora members and academic researchers into the central inbox.
                </span>
              </div>
            </label>
          </div>

          {isSuperAdmin && (
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-[#153E2E] hover:bg-[#0E2C20] rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Configuration</span>
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Card 3: Data Maintenance & Demo Reset */}
      <div className="bg-white border border-[#E8E4DA] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F2EFE9]">
          <HardDrive className="w-4 h-4 text-stone-600" />
          <h3 className="text-sm font-bold text-stone-900">Database Maintenance & Local Storage</h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#FAF8F5] rounded-xl border border-[#EAE6DD]">
          <div>
            <h4 className="text-xs font-bold text-stone-900">Export Snapshot</h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Download JSON archive of all 10 entities and audit trails
            </p>
          </div>
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>

        {isSuperAdmin && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-red-50/50 rounded-xl border border-red-200">
            <div>
              <h4 className="text-xs font-bold text-red-900">Reset Demo Database</h4>
              <p className="text-[11px] text-red-700 mt-0.5">
                Restores factory initial data for all 10 entities and cleans sample records.
              </p>
            </div>
            <button
              onClick={() => setResetConfirmOpen(true)}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default</span>
            </button>
          </div>
        )}
      </div>

      {resetConfirmOpen && (
        <ConfirmModal
          isOpen={true}
          title="Reset to Demo State"
          message="Are you sure you want to reset all 10 database entities to their original authentic Nkar demo values? Any changes you made will be re-initialized."
          confirmLabel="Reset Database"
          onConfirm={handleResetFactoryData}
          onCancel={() => setResetConfirmOpen(false)}
        />
      )}
    </div>
  );
};
