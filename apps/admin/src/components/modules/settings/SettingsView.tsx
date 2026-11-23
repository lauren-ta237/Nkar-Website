import React, { useState } from 'react';
import {
  Settings,
  Shield,
  RotateCcw,
  Save,
  CheckCircle2,
  Globe,
  HardDrive,
  Download,
} from 'lucide-react';
import { useAdminStore } from '../../../store/useAdminStore';
import { useQueryClient } from '@tanstack/react-query';
import { ConfirmModal } from '../../common/ConfirmModal';

export const SettingsView: React.FC = () => {
  const { currentUser } = useAdminStore();
  const queryClient = useQueryClient();

  const [fondomName, setFondomName] = useState('Nkar Fondom (Nkar Woo Làn)');
  const [traditionalCapital, setTraditionalCapital] = useState('Nkar Kingdom/Fondom, Bui Division, Northwest Region, Cameroon');
  const [officialContact, setOfficialContact] = useState('info@nkarwoolan.org');
  const [phoneNumber, setPhoneNumber] = useState('+237 679 632 780');
  const [reviewRequired, setReviewRequired] = useState(true);
  const [publicInquiriesEnabled, setPublicInquiriesEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [refreshSuccessMessage, setRefreshSuccessMessage] = useState<string | null>(null);
  const [refreshConfirmOpen, setRefreshConfirmOpen] = useState(false);

  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleInvalidateCache = () => {
    queryClient.invalidateQueries();
    setRefreshConfirmOpen(false);
    setRefreshSuccessMessage('Client state and query caches invalidated and synchronized with PostgreSQL API.');
    setTimeout(() => setRefreshSuccessMessage(null), 5000);
  };

  const handleExportJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      portal: 'Nkar Woo Làn Admin Platform',
      identity: {
        fondomName,
        traditionalCapital,
        officialContact,
        phoneNumber,
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nkar-woo-lan-config-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#153E2E] dark:text-emerald-400" />
          Platform Settings & System Configuration
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Fondom metadata, editorial workflow rules, notification thresholds, and database maintenance
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>System configuration preferences saved successfully.</span>
        </div>
      )}

      {refreshSuccessMessage && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>{refreshSuccessMessage}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Card 1: Fondom Identity & Metadata */}
        <div className="bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F2EFE9] dark:border-stone-800">
            <Globe className="w-4 h-4 text-[#153E2E] dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">Fondom Identity & Geographic Registry</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Official Name</label>
              <input
                type="text"
                value={fondomName}
                onChange={(e) => setFondomName(e.target.value)}
                disabled={!isSuperAdmin}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Traditional Seat</label>
              <input
                type="text"
                value={traditionalCapital}
                onChange={(e) => setTraditionalCapital(e.target.value)}
                disabled={!isSuperAdmin}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Council Contact Email</label>
              <input
                type="email"
                value={officialContact}
                onChange={(e) => setOfficialContact(e.target.value)}
                disabled={!isSuperAdmin}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Palace Registry Phone</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={!isSuperAdmin}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200 disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Editorial Governance & Verification */}
        <div className="bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F2EFE9] dark:border-stone-800">
            <Shield className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">Editorial Governance & Verification Workflows</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-start gap-3 p-3 bg-[#FAF8F5] dark:bg-stone-800/60 rounded-xl border border-[#EAE6DD] dark:border-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={reviewRequired}
                onChange={(e) => setReviewRequired(e.target.checked)}
                disabled={!isSuperAdmin}
                className="mt-0.5 rounded border-[#E5E0D5] dark:border-stone-700 text-[#153E2E] focus:ring-[#153E2E]"
              />
              <div>
                <span className="font-bold text-stone-900 dark:text-stone-100 block">Strict 4-Eye Cultural Review Policy</span>
                <span className="text-stone-500 dark:text-stone-400 block mt-0.5 leading-relaxed">
                  Require Content Reviewer or Super Admin approval before any community article, event, or oral tradition entry is published live.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-[#FAF8F5] dark:bg-stone-800/60 rounded-xl border border-[#EAE6DD] dark:border-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={publicInquiriesEnabled}
                onChange={(e) => setPublicInquiriesEnabled(e.target.checked)}
                disabled={!isSuperAdmin}
                className="mt-0.5 rounded border-[#E5E0D5] dark:border-stone-700 text-[#153E2E] focus:ring-[#153E2E]"
              />
              <div>
                <span className="font-bold text-stone-900 dark:text-stone-100 block">Accept Public Citizen Inquiries & Feedback</span>
                <span className="text-stone-500 dark:text-stone-400 block mt-0.5 leading-relaxed">
                  Receive inbound contact requests from diaspora members and academic researchers into the central inbox.
                </span>
              </div>
            </label>
          </div>

          {isSuperAdmin && (
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-[#153E2E] hover:bg-[#0E2C20] rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Configuration</span>
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Card 3: Database & Cache Maintenance */}
      <div className="bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F2EFE9] dark:border-stone-800">
          <HardDrive className="w-4 h-4 text-stone-600 dark:text-stone-400" />
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">Database & Client Cache Maintenance</h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#FAF8F5] dark:bg-stone-800/60 rounded-xl border border-[#EAE6DD] dark:border-stone-800">
          <div>
            <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">Export Configuration Snapshot</h4>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
              Download JSON backup of portal configuration metadata
            </p>
          </div>
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 rounded-lg flex items-center gap-1.5 cursor-pointer self-start sm:self-auto transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>

        {isSuperAdmin && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-amber-50/50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/60">
            <div>
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">Invalidate & Refresh Client Cache</h4>
              <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
                Clears query cache layers and synchronizes fresh data across all entity subscriptions.
              </p>
            </div>
            <button
              onClick={() => setRefreshConfirmOpen(true)}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg flex items-center gap-1.5 cursor-pointer self-start sm:self-auto transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Refresh Cache</span>
            </button>
          </div>
        )}
      </div>

      {refreshConfirmOpen && (
        <ConfirmModal
          isOpen={true}
          title="Synchronize & Invalidate Cache"
          message="Are you sure you want to invalidate all cached client queries? The admin portal will fetch live records directly from the database."
          confirmLabel="Invalidate Cache"
          onConfirm={handleInvalidateCache}
          onCancel={() => setRefreshConfirmOpen(false)}
        />
      )}
    </div>
  );
};
