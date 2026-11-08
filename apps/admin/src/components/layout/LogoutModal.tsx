import React from 'react';
import { LogOut, ShieldAlert } from 'lucide-react';
import { useAdminStore, INITIAL_USERS } from '../../store/useAdminStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export const LogoutModal: React.FC = () => {
  const { logoutConfirmOpen, setLogoutConfirmOpen, currentUser, setCurrentUser, switchRole } =
    useAdminStore();

  const handleConfirmLogout = () => {
    // Switch to alternate council admin or reset
    setLogoutConfirmOpen(false);
    // Cycle to editor or reset
    switchRole('CONTENT_EDITOR');
  };

  return (
    <Dialog open={logoutConfirmOpen} onOpenChange={setLogoutConfirmOpen}>
      <DialogContent className="max-w-md bg-white dark:bg-stone-900 border border-[#E5E0D5] dark:border-stone-800 p-5 rounded-2xl shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
            <LogOut className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <DialogHeader className="text-left p-0 gap-1">
              <DialogTitle className="text-sm font-bold text-stone-900 dark:text-stone-100">
                End Administrative Session?
              </DialogTitle>
              <DialogDescription className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                You are currently signed in as <strong className="text-stone-900 dark:text-stone-200">{currentUser.name}</strong> ({currentUser.role.replace('_', ' ')}). You will need to re-authenticate to make further editorial modifications.
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <DialogFooter className="mt-4 pt-3 border-t border-[#E8E4DA] dark:border-stone-800 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={() => setLogoutConfirmOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700/50 rounded-lg cursor-pointer"
          >
            Stay Signed In
          </button>
          <button
            type="button"
            onClick={handleConfirmLogout}
            className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            Confirm Logout
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
