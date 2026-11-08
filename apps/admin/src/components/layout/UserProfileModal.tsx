import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  Check,
  Lock,
  Phone,
  Mail,
  Calendar,
  Key,
  Edit2,
  Save,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { useUsersMutations } from '../../api/queries';
import { FileUpload } from '../common/FileUpload';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

export const UserProfileModal: React.FC = () => {
  const { profileModalOpen, setProfileModalOpen, currentUser } = useAdminStore();
  const { updateProfileMutation } = useUsersMutations();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setPhone(currentUser.phone || '');
      setTitle(currentUser.title || '');
      setAvatar(currentUser.avatar || '');
      setError(null);
      setSuccessMsg(null);
      setIsEditing(false);
    }
  }, [currentUser, profileModalOpen]);

  if (!profileModalOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Full name is required.');
      return;
    }

    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    updateProfileMutation.mutate(
      {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        title: title.trim() || undefined,
        avatar: avatar.trim() || undefined,
      },
      {
        onSuccess: () => {
          setSuccessMsg('Profile information updated and saved successfully.');
          setIsEditing(false);
          setTimeout(() => setSuccessMsg(null), 3500);
        },
        onError: (err: any) => {
          setError(err.message || 'Failed to update profile.');
        },
      }
    );
  };

  const permissions = {
    SUPER_ADMIN: [
      { name: 'Full Database CRUD across all 10 entities', granted: true },
      { name: 'Administrator Account Provisioning & Role Assignment', granted: true },
      { name: 'Account Suspension & Activation', granted: true },
      { name: 'Direct Content Publication & Archiving', granted: true },
      { name: 'System Audit Logs Inspection (Immutable)', granted: true },
      { name: 'Platform Settings & Factory Reset', granted: true },
    ],
    CONTENT_REVIEWER: [
      { name: 'Review Submitted Community Content', granted: true },
      { name: 'Approve or Reject with Mandatory Notes', granted: true },
      { name: 'Publish Approved Heritage & News Items', granted: true },
      { name: 'Archive Obsolete Records', granted: true },
      { name: 'Manage Administrator Accounts', granted: false },
      { name: 'Inspect System Audit Logs', granted: false },
    ],
    CONTENT_EDITOR: [
      { name: 'Create Draft Articles, Events & Heritage Items', granted: true },
      { name: 'Edit Own Author Records', granted: true },
      { name: 'Submit Records for Committee Review', granted: true },
      { name: 'Directly Publish to Live Website', granted: false },
      { name: 'Approve/Reject Content Submissions', granted: false },
      { name: 'Manage Administrators or Audit Logs', granted: false },
    ],
  }[currentUser.role];

  return (
    <Sheet open={profileModalOpen} onOpenChange={setProfileModalOpen}>
      <SheetContent side="right" className="w-full sm:max-w-lg md:max-w-xl p-0 flex flex-col bg-white border-l border-[#E5E0D5]">
        {/* Header with African Gold decorative bar */}
        <div className="h-2 african-pattern-border shrink-0" />
        <SheetHeader className="p-4 sm:p-5 border-b border-[#E8E4DA] bg-[#FAF8F5] text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#153E2E]" />
            <SheetTitle className="font-bold text-stone-900 text-sm">
              {isEditing ? 'Edit Administrator Profile' : 'Administrator Profile & Account'}
            </SheetTitle>
          </div>
          <SheetDescription className="text-xs text-stone-500">
            Nkar Woo Làn administrative credentials, verified contact details, and role authorization scope
          </SheetDescription>
        </SheetHeader>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isEditing ? (
            /* View Mode */
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[#D4AF37] shadow-sm shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-base font-bold text-stone-900 leading-tight truncate">
                      {currentUser.name}
                    </h4>
                    <p className="text-xs text-[#153E2E] font-semibold mt-0.5 truncate">
                      {currentUser.title || 'Administrative Officer'}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[#153E2E] text-white rounded">
                        {currentUser.role.replace('_', ' ')}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded">
                        {currentUser.status}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-[#153E2E] bg-[#EAF2EE] hover:bg-[#D4E8DC] border border-[#153E2E]/20 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              </div>

              {/* Details List */}
              <div className="bg-[#FAF8F5] border border-[#E8E4DA] rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-stone-600">
                  <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">{currentUser.email}</span>
                </div>
                {currentUser.phone && (
                  <div className="flex items-center gap-2 text-stone-600">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{currentUser.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-stone-600">
                  <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>Registered: {new Date(currentUser.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Role Security Protection Banner */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <span className="font-bold">Role Protection Guarantee: </span>
                  Administrator roles cannot be changed in personal profile settings. Only a designated{' '}
                  <span className="font-semibold">Super Admin</span> can assign or modify administrative roles through the User Management console.
                </div>
              </div>

              {/* Scope of Permissions */}
              <div>
                <h5 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Your Role Authorization Scope
                </h5>
                <div className="space-y-1.5 bg-stone-50 border border-stone-200/60 rounded-xl p-3 text-xs">
                  {permissions.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between py-0.5">
                      <span className={p.granted ? 'text-stone-700' : 'text-stone-400 line-through'}>
                        {p.name}
                      </span>
                      {p.granted ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Edit Mode Form */
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Direct Profile Picture Upload (Requirement 3 & 4) */}
              <div>
                <FileUpload
                  label="Profile Picture"
                  value={avatar}
                  onChange={(url) => setAvatar(url)}
                  accept="image/*"
                  helperText="Upload JPG, PNG, or WebP portrait photograph"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fon Martin Fongang"
                  className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#153E2E] text-stone-900 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="official@nkarwoolad.cm"
                  className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#153E2E] text-stone-800"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Telephone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+237 6XX XX XX XX"
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Traditional / Administrative Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Council Secretary"
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
                  />
                </div>
              </div>

              {/* Read-Only Role Warning (Requirement 5) */}
              <div className="p-3 bg-stone-100/70 border border-stone-200 rounded-xl text-xs text-stone-600">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-700">Assigned Council Role:</span>
                  <span className="font-bold text-[#153E2E] bg-white px-2 py-0.5 rounded border border-stone-200 uppercase font-mono text-[11px]">
                    {currentUser.role.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[10px] text-stone-400 mt-1">
                  Protected: Role cannot be edited in personal profile. Only Super Admins can alter role assignments.
                </p>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-3 border-t border-[#E8E4DA] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={updateProfileMutation.isPending}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#153E2E] hover:bg-[#0D291F] rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{updateProfileMutation.isPending ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        {!isEditing && (
          <div className="p-4 border-t border-[#E8E4DA] bg-[#FAF8F5] flex justify-between items-center shrink-0">
            <span className="text-[11px] text-stone-400">Nkar Woo Làn Authenticated Council Session</span>
            <button
              onClick={() => setProfileModalOpen(false)}
              className="px-4 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
