import React, { useState, useEffect } from 'react';
import {
  Shield,
  Check,
  Lock,
  Mail,
  Calendar,
  Key,
  Edit2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { useAdminUsersMutations } from '@/lib/api/users.api';
import { FileUpload } from '../common/FileUpload';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

export const UserProfileModal: React.FC = () => {
  const { profileModalOpen, setProfileModalOpen, currentUser, setCurrentUser } = useAdminStore();
  const { updateProfileMutation } = useAdminUsersMutations();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setAvatar(currentUser.avatar_url || '');
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
        id: currentUser.id,
        data: {
          name: name.trim(),
          email: email.trim(),
          avatar_url: avatar.trim() || null,
        },
      },
      {
        onSuccess: (updatedUser: any) => {
          const updatedName = name.trim();
          const updatedEmail = email.trim();
          const updatedAvatar = avatar.trim() || null;
          setCurrentUser({
            ...currentUser,
            name: updatedUser?.name || updatedName,
            email: updatedUser?.email || updatedEmail,
            avatar_url: updatedUser?.avatar_url !== undefined ? updatedUser.avatar_url : updatedAvatar,
          });
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

  const normalizedRole = (currentUser.role || 'CONTENT_EDITOR').toUpperCase() as
    | 'SUPER_ADMIN'
    | 'CONTENT_REVIEWER'
    | 'CONTENT_EDITOR';

  const rolePermissionsMap = {
    SUPER_ADMIN: [
      { name: 'Full Database CRUD across all system entities', granted: true },
      { name: 'Administrator Account Provisioning & Role Assignment', granted: true },
      { name: 'Account Suspension & Activation', granted: true },
      { name: 'Direct Content Publication & Archiving', granted: true },
      { name: 'System Audit Logs Inspection (Immutable)', granted: true },
      { name: 'Platform Settings & System Maintenance', granted: true },
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
  };

  const permissions = rolePermissionsMap[normalizedRole] || rolePermissionsMap.CONTENT_EDITOR;

  return (
    <Sheet open={profileModalOpen} onOpenChange={setProfileModalOpen}>
      <SheetContent side="right" className="w-full sm:max-w-lg md:max-w-xl p-0 flex flex-col bg-white dark:bg-stone-900 border-l border-[#E5E0D5] dark:border-stone-800 text-stone-900 dark:text-stone-100">
        <div className="h-2 african-pattern-border shrink-0" />
        <SheetHeader className="p-4 sm:p-5 border-b border-[#E8E4DA] dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#153E2E] dark:text-emerald-400" />
            <SheetTitle className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              {isEditing ? 'Edit Administrator Profile' : 'Administrator Profile & Account'}
            </SheetTitle>
          </div>
          <SheetDescription className="text-xs text-stone-500 dark:text-stone-400">
            Nkar Woo Làn administrative credentials, verified contact details, and role authorization scope
          </SheetDescription>
        </SheetHeader>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
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
                    src={currentUser.avatar_url || ''}
                    alt={currentUser.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[#D4AF37] shadow-sm shrink-0 bg-stone-100 dark:bg-stone-800"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 leading-tight truncate">
                      {currentUser.name}
                    </h4>
                    <p className="text-xs text-[#153E2E] dark:text-emerald-400 font-semibold mt-0.5 truncate">
                      Administrative Officer
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[#153E2E] dark:bg-emerald-800 text-white rounded">
                        {currentUser.role.replace('_', ' ')}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded">
                        {currentUser.status}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-[#153E2E] dark:text-emerald-300 bg-[#EAF2EE] dark:bg-emerald-950/60 hover:bg-[#D4E8DC] dark:hover:bg-emerald-900/60 border border-[#153E2E]/20 dark:border-emerald-700 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              </div>

              {/* Details List */}
              <div className="bg-[#FAF8F5] dark:bg-stone-800/60 border border-[#E8E4DA] dark:border-stone-700 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                  <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">{currentUser.email}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                  <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>Registered: {new Date(currentUser.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Role Security Protection Banner */}
              <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <span className="font-bold">Role Protection Guarantee: </span>
                  Administrator roles cannot be changed in personal profile settings. Only a designated{' '}
                  <span className="font-semibold">Super Admin</span> can assign or modify administrative roles through the User Management console.
                </div>
              </div>

              {/* Scope of Permissions */}
              <div>
                <h5 className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Your Role Authorization Scope
                </h5>
                <div className="space-y-1.5 bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700 rounded-xl p-3 text-xs">
                  {permissions.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between py-0.5">
                      <span className={p.granted ? 'text-stone-700 dark:text-stone-200' : 'text-stone-400 dark:text-stone-500 line-through'}>
                        {p.name}
                      </span>
                      {p.granted ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-stone-300 dark:text-stone-600 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Edit Mode Form */
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Full Administrator Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-900 dark:text-stone-100 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200"
                  required
                />
              </div>

              <FileUpload
                label="Profile Picture / Avatar"
                value={avatar}
                onChange={setAvatar}
                accept="image/*"
                mediaTypeHint="image"
                folder="nkar_woo_lan/admins"
                helperText="Upload official profile portrait (JPEG, PNG, WebP up to 10MB)"
              />

              <div className="pt-4 border-t border-[#E8E4DA] dark:border-stone-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#153E2E] hover:bg-[#0D291F] rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
