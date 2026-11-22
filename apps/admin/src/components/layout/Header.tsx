import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  User as UserIcon,
  Settings,
  Globe,
  Sun,
  Moon,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import { useAdminDashboardStats } from '@/lib/api/dashboard.api';
import { useAdminUsersList } from '@/lib/api/users.api';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    setSearchModalOpen,
    notificationDrawerOpen,
    setNotificationDrawerOpen,
    setProfileModalOpen,
    setMobileSidebarOpen,
    theme,
    toggleTheme,
    setLogoutConfirmOpen,
  } = useAdminStore();

  const { data: stats } = useAdminDashboardStats();

  const publicSiteUrl = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';
  const toHttpsHeaderAvatar = (url?: string | null): string =>
    url ? url.trim().replace(/^http:\/\//i, 'https://') : '';

  const { data: liveHeaderUsers = [] } = useAdminUsersList();
  const matchedHeaderUser = liveHeaderUsers.find(
    (u: any) =>
      (currentUser?.id && u.id === currentUser.id) ||
      (currentUser?.email && u.email?.toLowerCase() === currentUser.email?.toLowerCase())
  );
  const effectiveHeaderAvatar = toHttpsHeaderAvatar(
    currentUser?.avatar_url || matchedHeaderUser?.avatar_url
  );

  const handleOpenPublicSite = () => {
    window.open(publicSiteUrl, '_blank', 'noopener,noreferrer');
  };

  const totalNotifications = (stats?.pendingReviews || 0) + (stats?.unreadMessages || 0);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-[#E8E4DA] dark:border-stone-800 px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors">
      {/* Left: Mobile Toggle & Emblem */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger Navigation Button */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer shrink-0"
          title="Open Navigation Menu"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5 text-[#153E2E] dark:text-emerald-400" />
        </button>

        {/* Mobile Mini Emblem */}
        <div className="lg:hidden flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#D4AF37]/60 shadow-xs bg-black flex items-center justify-center">
            <img
              src="/assets/logo.jpeg"
              alt="Nkar Woo Làn"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-bold text-xs tracking-wider text-[#153E2E] dark:text-emerald-400 uppercase hidden xs:inline">
            Nkar Woo Làn
          </span>
        </div>

        {/* Global Search trigger */}
        <button
          onClick={() => setSearchModalOpen(true)}
          className="flex items-center gap-2.5 w-48 sm:w-72 md:w-80 px-3 py-1.5 text-xs text-stone-500 dark:text-stone-400 bg-[#F9F8F5] dark:bg-stone-800/80 hover:bg-[#F2EFE9] dark:hover:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-lg transition-colors group cursor-pointer text-left truncate"
          title="Press Command+K or click to search"
        >
          <Search className="w-3.5 h-3.5 text-[#8C8270] dark:text-stone-400 group-hover:text-[#153E2E] dark:group-hover:text-emerald-400 transition-colors shrink-0" />
          <span className="truncate hidden sm:inline">Search articles, events, archives...</span>
          <span className="truncate sm:hidden">Search...</span>
          <kbd className="hidden md:inline-block ml-auto text-[10px] font-mono bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 px-1.5 py-0.5 rounded text-stone-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Actions, Theme, Live Site & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* View Public Portal */}
        <button
          onClick={handleOpenPublicSite}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#153E2E] dark:text-emerald-400 bg-[#EAF2EE] dark:bg-emerald-950/40 hover:bg-[#D5E5DC] dark:hover:bg-emerald-900/50 border border-[#153E2E]/20 dark:border-emerald-800/40 rounded-lg transition-colors cursor-pointer"
          title="Open live public portal in new tab"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => setNotificationDrawerOpen(!notificationDrawerOpen)}
          className="relative p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:text-[#153E2E] dark:hover:text-emerald-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
          title="Notifications & Review Queue"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {totalNotifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-[#D4AF37] text-stone-950 text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-stone-900">
              {totalNotifications > 99 ? '99+' : totalNotifications}
            </span>
          )}
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-stone-600" />
          )}
        </button>

        {/* User Profile Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 p-1 sm:p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer text-left border-0 bg-transparent outline-none">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#153E2E] dark:bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0 border border-[#D4AF37]/50 shadow-xs">
              {effectiveHeaderAvatar ? (
                <img
                  src={effectiveHeaderAvatar}
                  alt={currentUser?.name || 'Administrator'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <span>{currentUser?.name?.charAt(0)?.toUpperCase() || 'A'}</span>
              )}
            </div>
            <div className="hidden md:block max-w-[120px]">
              <p className="text-xs font-semibold text-stone-800 dark:text-stone-100 truncate">
                {currentUser?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 uppercase tracking-wider truncate">
                {currentUser?.role?.replace(/_/g, ' ') || 'Admin'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden md:block" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-60 bg-white dark:bg-stone-900 border border-[#E5E0D5] dark:border-stone-800 rounded-xl shadow-xl p-1.5">
            <div className="p-2 border-b border-stone-100 dark:border-stone-800 mb-1">
              <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">{currentUser?.name || 'Administrator'}</p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">{currentUser?.email || ''}</p>
              <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-bold bg-[#153E2E] dark:bg-emerald-800 text-white rounded">
                {(currentUser?.role || 'SUPER_ADMIN').replace('_', ' ')}
              </span>
            </div>

            <DropdownMenuItem
              onClick={() => setProfileModalOpen(true)}
              className="p-2 rounded-lg text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer flex items-center gap-2 outline-none"
            >
              <UserIcon className="w-3.5 h-3.5 text-stone-500" />
              <span>Edit Profile & Avatar</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleOpenPublicSite}
              className="p-2 rounded-lg text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer flex items-center gap-2 outline-none"
            >
              <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Visit Public Website</span>
              <ExternalLink className="w-3 h-3 text-stone-400 ml-auto" />
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={toggleTheme}
              className="p-2 rounded-lg text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer flex items-center gap-2 outline-none"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Switch to Light Theme</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-stone-500" />
                  <span>Switch to Dark Theme</span>
                </>
              )}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => navigate('/settings')}
              className="p-2 rounded-lg text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer flex items-center gap-2 outline-none"
            >
              <Settings className="w-3.5 h-3.5 text-stone-500" />
              <span>Council Portal Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 bg-[#E8E4DA] dark:border-stone-800" />

            <DropdownMenuItem
              onClick={() => setLogoutConfirmOpen(true)}
              className="p-2 rounded-lg text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer flex items-center gap-2 outline-none"
            >
              <LogOut className="w-3.5 h-3.5 text-red-500" />
              <span className="font-medium">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
