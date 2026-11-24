import React, { useState, useEffect } from 'react';
import { Shield, AlertCircle, Lock, Eye, EyeOff } from 'lucide-react';
import { User, Role, UserStatus } from '../../../types';
import { useAdminStore } from '../../../store/useAdminStore';
import { FileUpload } from '../../common/FileUpload';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

interface UserFormModalProps {
  isOpen: boolean;
  initialData?: User | null;
  onClose: () => void;
  onSubmit: (data: Omit<User, 'id' | 'created_at' | 'updated_at'> & { password?: string }) => void;
  isLoading?: boolean;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const { currentUser } = useAdminStore();
  const isSelf = initialData?.id === currentUser?.id;
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>('CONTENT_EDITOR');
  const [status, setStatus] = useState<UserStatus>('ACTIVE');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
      setRole(initialData.role);
      setStatus(initialData.status);
      setAvatarUrl(initialData.avatar_url || '');
      setPassword('');
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setRole('CONTENT_EDITOR');
      setStatus('ACTIVE');
      setAvatarUrl('');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Name and official email are required.');
      return;
    }

    if (!initialData && (!password || password.length < 8)) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    onSubmit({
      name: name.trim(),
      email: email.trim(),
      role,
      status,
      avatar_url: avatarUrl.trim() || null,
      ...(password ? { password } : {}),
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col bg-white dark:bg-stone-900 border-l border-[#E5E0D5] dark:border-stone-800 text-stone-900 dark:text-stone-100">
        <SheetHeader className="p-5 border-b border-[#E8E4DA] dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 text-left">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#153E2E] dark:text-emerald-400" />
            <SheetTitle className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              {initialData ? 'Edit Administrator Profile' : 'Provision Administrator Account'}
            </SheetTitle>
          </div>
          <SheetDescription className="text-xs text-stone-500 dark:text-stone-400">
            Control access roles, assign council credentials, and enforce privilege separation
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fai Martin Fongang"
              className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-900 dark:text-stone-100 font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Official Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer@nkarwoolan.org"
              className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Council Role / System Permission *</label>
              {isSelf && (
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded flex items-center gap-1 border border-amber-200 dark:border-amber-800">
                  <Lock className="w-3 h-3" /> Cannot change your own role
                </span>
              )}
            </div>
            <select
              value={role}
              disabled={isSelf || !isSuperAdmin}
              onChange={(e) => setRole(e.target.value as Role)}
              className={`w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none font-semibold ${
                isSelf || !isSuperAdmin ? 'bg-stone-100 dark:bg-stone-800 text-stone-500 cursor-not-allowed opacity-80' : 'text-stone-800 dark:text-stone-200'
              }`}
            >
              <option value="SUPER_ADMIN">SUPER ADMIN — Full Platform Governance & User Control</option>
              <option value="CONTENT_REVIEWER">CONTENT REVIEWER — Verify Submissions, Approve & Publish</option>
              <option value="CONTENT_EDITOR">CONTENT EDITOR — Draft Content & Submit for Verification</option>
            </select>
            {isSelf && (
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                For security and governance integrity, administrators cannot modify or escalate their own system roles.
              </p>
            )}
            {!isSuperAdmin && !isSelf && (
              <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">
                Only the Super Admin can assign or alter administrator roles.
              </p>
            )}
          </div>

          {!initialData && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Temporary Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full text-xs p-2.5 pr-10 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Account State</label>
            <select
              value={status}
              disabled={isSelf}
              onChange={(e) => setStatus(e.target.value as UserStatus)}
              className={`w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200 ${
                isSelf ? 'bg-stone-100 dark:bg-stone-800 text-stone-500 cursor-not-allowed opacity-80' : ''
              }`}
            >
              <option value="ACTIVE">Active (Normal Access)</option>
              <option value="SUSPENDED">Suspended (Blocked Access)</option>
            </select>
          </div>

          <FileUpload
            label="Administrator Profile Picture"
            value={avatarUrl}
            onChange={setAvatarUrl}
            accept="image/*"
            mediaTypeHint="image"
            folder="nkar_woo_lan/users"
            helperText="Upload official profile portrait (JPEG, PNG, WebP up to 10MB)"
          />

          <div className="pt-4 border-t border-[#E8E4DA] dark:border-stone-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-xs font-bold text-white bg-[#153E2E] hover:bg-[#0D291F] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {isLoading ? 'Saving...' : initialData ? 'Save Changes' : 'Provision Account'}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
