import React from 'react';
import {
  LayoutDashboard,
  Newspaper,
  CalendarDays,
  Landmark,
  Crown,
  Image as ImageIcon,
  BookOpen,
  Briefcase,
  Mail,
  Users,
  ShieldAlert,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  ExternalLink,
  X,
  Globe,
  LogOut,
  Sun,
  Moon,
  User as UserIcon,
} from 'lucide-react';
import { useAdminStore, AdminPage, INITIAL_USERS } from '../../store/useAdminStore';
import { useDashboardStats } from '../../api/queries';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface NavItem {
  page: AdminPage;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeKey?: 'pendingReviews' | 'unreadMessages';
  superAdminOnly?: boolean;
}

export const Sidebar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    sidebarCollapsed,
    toggleSidebar,
    currentUser,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    setProfileModalOpen,
    setPublicPreviewOpen,
    setLogoutConfirmOpen,
    theme,
    toggleTheme,
    switchRole,
  } = useAdminStore();
  const { data: stats } = useDashboardStats();

  const navItems: NavItem[] = [
    { page: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { page: 'news', label: 'News & Announcements', icon: Newspaper, badgeKey: 'pendingReviews' },
    { page: 'events', label: 'Events Management', icon: CalendarDays },
    { page: 'heritage', label: 'Heritage Management', icon: Landmark },
    { page: 'leadership', label: 'Traditional Leadership', icon: Crown },
    { page: 'gallery', label: 'Gallery Management', icon: ImageIcon },
    { page: 'publications', label: 'Books & Publications', icon: BookOpen },
    { page: 'projects', label: 'Development Projects', icon: Briefcase },
    { page: 'contact', label: 'Contact Submissions', icon: Mail, badgeKey: 'unreadMessages' },
    { page: 'users', label: 'User Management', icon: Users, superAdminOnly: true },
    { page: 'audit', label: 'Audit Logs', icon: ShieldAlert, superAdminOnly: true },
    { page: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderNavList = (isMobile: boolean = false) => (
    <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
      {navItems.map((item) => {
        const isActive = currentPage === item.page;
        const Icon = item.icon;
        const isRestricted = item.superAdminOnly && currentUser.role !== 'SUPER_ADMIN';

        let badgeCount = 0;
        if (item.badgeKey === 'pendingReviews') {
          badgeCount = stats?.pendingReviews || 0;
        } else if (item.badgeKey === 'unreadMessages') {
          badgeCount = stats?.unreadMessages || 0;
        }

        return (
          <button
            key={item.page}
            onClick={() => {
              setCurrentPage(item.page);
              if (isMobile) setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer relative ${
              isActive
                ? 'bg-[#153E2E] text-white shadow-sm shadow-[#153E2E]/20'
                : isRestricted
                ? 'text-stone-400 hover:bg-stone-50'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
            }`}
            title={item.label}
          >
            {isActive && (
              <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#D4AF37] rounded-r-full" />
            )}

            <Icon
              className={`w-4 h-4 shrink-0 transition-transform ${
                isActive ? 'text-[#D4AF37]' : isRestricted ? 'text-stone-300' : 'text-stone-500 group-hover:text-stone-800'
              }`}
            />

            {(!sidebarCollapsed || isMobile) && (
              <div className="flex-1 flex items-center justify-between min-w-0">
                <span className="truncate">{item.label}</span>

                <div className="flex items-center gap-1.5 shrink-0">
                  {badgeCount > 0 && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-md tabular-nums ${
                        isActive
                          ? 'bg-[#D4AF37] text-[#153E2E]'
                          : 'bg-[#D4AF37]/20 text-[#8B6508]'
                      }`}
                    >
                      {badgeCount}
                    </span>
                  )}

                  {isRestricted && (
                    <span className="text-[9px] uppercase px-1 py-0.5 rounded text-stone-400 bg-stone-100 font-mono">
                      Locked
                    </span>
                  )}
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );

  const renderCouncilAdmins = (isMobile: boolean = false) => {
    if (sidebarCollapsed && !isMobile) {
      return (
        <div className="p-3 border-t border-[#E8E4DA] dark:border-stone-800 flex justify-center shrink-0">
          <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-50 dark:ring-emerald-950" title="System Online" />
        </div>
      );
    }

    return (
      <div className="p-3 border-t border-[#E8E4DA] dark:border-stone-800 bg-[#FAF8F5]/50 dark:bg-stone-950/40 shrink-0">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            Council Admins
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500" title="System Online" />
        </div>

        <div className="space-y-1.5">
          {INITIAL_USERS.map((user) => {
            const isCurrent = currentUser.id === user.id;
            return (
              <div
                key={user.id}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${
                  isCurrent
                    ? 'bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-stone-900" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-stone-800 dark:text-stone-200 truncate leading-tight">
                    {user.name.split(' ')[0]} {user.name.split(' ')[1] || ''}
                  </p>
                  <p className="text-[10px] text-stone-400 dark:text-stone-500 truncate leading-tight">
                    {user.role === 'SUPER_ADMIN' ? 'Super Admin' : user.role === 'CONTENT_REVIEWER' ? 'Reviewer' : 'Editor'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSidebarFooter = (isMobile: boolean = false) => {
    const isCollapsed = sidebarCollapsed && !isMobile;

    if (isCollapsed) {
      return (
        <div className="p-2 border-t border-[#E8E4DA] dark:border-stone-800 flex flex-col items-center gap-2 bg-[#FAF8F5]/80 dark:bg-stone-950/80 shrink-0">
          {/* Collapsed Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="relative cursor-pointer p-0.5 rounded-full hover:ring-2 hover:ring-[#D4AF37] transition-all">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#D4AF37]"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-stone-900" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-56 bg-white dark:bg-stone-900 border border-[#E5E0D5] dark:border-stone-800 rounded-xl shadow-xl p-1.5 ml-2">
              <div className="p-2 border-b border-stone-100 dark:border-stone-800 mb-1">
                <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">{currentUser.name}</p>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">{currentUser.email}</p>
              </div>
              <DropdownMenuItem
                onClick={() => setProfileModalOpen(true)}
                className="p-2 rounded-lg text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer flex items-center gap-2 outline-none"
              >
                <UserIcon className="w-3.5 h-3.5 text-stone-500" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setPublicPreviewOpen(true)}
                className="p-2 rounded-lg text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer flex items-center gap-2 outline-none"
              >
                <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Visit Public Site</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={toggleTheme}
                className="p-2 rounded-lg text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer flex items-center gap-2 outline-none"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#D4AF37]" /> : <Moon className="w-3.5 h-3.5 text-stone-500" />}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 bg-[#E8E4DA] dark:bg-stone-800" />
              <DropdownMenuItem
                onClick={() => setLogoutConfirmOpen(true)}
                className="p-2 rounded-lg text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer flex items-center gap-2 outline-none"
              >
                <LogOut className="w-3.5 h-3.5 text-red-500" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Quick Icon: Public Site */}
          <button
            onClick={() => setPublicPreviewOpen(true)}
            className="p-2 text-stone-500 dark:text-stone-400 hover:text-[#153E2E] dark:hover:text-[#D4AF37] hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            title="Visit Public Website"
          >
            <Globe className="w-4 h-4" />
          </button>

          {/* Quick Icon: Logout */}
          <button
            onClick={() => setLogoutConfirmOpen(true)}
            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return (
      <div className="p-3 border-t border-[#E8E4DA] dark:border-stone-800 bg-[#FAF8F5]/80 dark:bg-stone-950/80 shrink-0 space-y-2">
        {/* Administrator Profile Dropdown Trigger */}
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full text-left outline-none">
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 hover:border-[#D4AF37] dark:hover:border-[#D4AF37] transition-all cursor-pointer shadow-2xs">
              <div className="relative shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#D4AF37]"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-stone-900" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate leading-tight">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-stone-400 dark:text-stone-500 truncate leading-tight">
                  {currentUser.role === 'SUPER_ADMIN' ? 'Super Admin' : currentUser.role === 'CONTENT_REVIEWER' ? 'Content Reviewer' : 'Content Editor'}
                </p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="top" align="start" className="w-60 bg-white dark:bg-stone-900 border border-[#E5E0D5] dark:border-stone-800 rounded-xl shadow-xl p-1.5 mb-1">
            <div className="p-2 border-b border-stone-100 dark:border-stone-800 mb-1">
              <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">{currentUser.name}</p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">{currentUser.email}</p>
              <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-bold bg-[#153E2E] dark:bg-emerald-800 text-white rounded">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>

            <DropdownMenuItem
              onClick={() => {
                setProfileModalOpen(true);
                if (isMobile) setMobileSidebarOpen(false);
              }}
              className="p-2 rounded-lg text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer flex items-center gap-2 outline-none"
            >
              <UserIcon className="w-3.5 h-3.5 text-stone-500" />
              <span>Edit Profile & Avatar</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setPublicPreviewOpen(true);
                if (isMobile) setMobileSidebarOpen(false);
              }}
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

            <DropdownMenuSeparator className="my-1 bg-[#E8E4DA] dark:bg-stone-800" />

            <DropdownMenuItem
              onClick={() => {
                setLogoutConfirmOpen(true);
                if (isMobile) setMobileSidebarOpen(false);
              }}
              className="p-2 rounded-lg text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer flex items-center gap-2 outline-none"
            >
              <LogOut className="w-3.5 h-3.5 text-red-500" />
              <span className="font-medium">Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quick Action Buttons: Public Site & Logout */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => {
              setPublicPreviewOpen(true);
              if (isMobile) setMobileSidebarOpen(false);
            }}
            className="py-1.5 px-2 bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-lg text-[11px] font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="Visit Public Website"
          >
            <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Public Site</span>
          </button>

          <button
            onClick={() => {
              setLogoutConfirmOpen(true);
              if (isMobile) setMobileSidebarOpen(false);
            }}
            className="py-1.5 px-2 bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 text-stone-600 dark:text-stone-400 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5 text-red-500" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 1. Desktop Fixed Sidebar (visible on lg screens) */}
      <aside
        className={`hidden lg:flex fixed top-0 bottom-0 left-0 z-40 bg-white dark:bg-stone-900 border-r border-[#E8E4DA] dark:border-stone-800 flex-col transition-all duration-300 ease-in-out select-none ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#E8E4DA] dark:border-stone-800 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Official Nkar Woo Làn Emblem Logo */}
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#D4AF37]/60 shadow-xs bg-black flex items-center justify-center">
              <img
                src="/assets/aistudio/image_63748073.png"
                alt="Nkar Woo Làn Official Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <h1 className="font-heritage text-sm font-bold text-[#153E2E] dark:text-emerald-400 tracking-wide truncate">
                  NKAR WOO LÀN
                </h1>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 uppercase tracking-widest truncate font-medium">
                  Heritage Admin Portal
                </p>
              </div>
            )}
          </div>

          {/* Sidebar Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Main Navigation List */}
        {renderNavList(false)}

        {/* Council Admins List */}
        {renderCouncilAdmins(false)}

        {/* Footer: Profile Dropdown, Public Site & Logout */}
        {renderSidebarFooter(false)}
      </aside>

      {/* 2. Mobile Responsive Navigation Drawer (shadcn Sheet with side="left") */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0 flex flex-col bg-white dark:bg-stone-900 border-r border-[#E8E4DA] dark:border-stone-800">
          <SheetHeader className="p-4 border-b border-[#E8E4DA] dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#D4AF37]/60 shadow-xs bg-black flex items-center justify-center">
                <img
                  src="/assets/aistudio/image_63748073.png"
                  alt="Nkar Woo Làn Official Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0">
                <SheetTitle className="font-heritage text-sm font-bold text-[#153E2E] dark:text-emerald-400 tracking-wide truncate">
                  NKAR WOO LÀN
                </SheetTitle>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 uppercase tracking-widest truncate font-medium">
                  Heritage Admin Portal
                </p>
              </div>
            </div>
          </SheetHeader>

          {/* Nav List */}
          {renderNavList(true)}

          {/* Council Admins in Mobile Sheet */}
          {renderCouncilAdmins(true)}

          {/* Footer in Mobile Sheet */}
          {renderSidebarFooter(true)}
        </SheetContent>
      </Sheet>
    </>
  );
};
