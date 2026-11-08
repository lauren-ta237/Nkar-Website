import {
  Search,
  Bell,
  ChevronDown,
  Shield,
  UserCheck,
  Edit3,
  Menu,
  User as UserIcon,
  Settings,
  Sparkles,
  Globe,
  Sun,
  Moon,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAdminStore, INITIAL_USERS, AdminPage } from '../../store/useAdminStore';
import { useDashboardStats } from '../../api/queries';
import { Role } from '../../types';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export const Header: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    currentUser,
    switchRole,
    setSearchModalOpen,
    notificationDrawerOpen,
    setNotificationDrawerOpen,
    setProfileModalOpen,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    theme,
    toggleTheme,
    setPublicPreviewOpen,
    setLogoutConfirmOpen,
  } = useAdminStore();

  const { data: stats } = useDashboardStats();

  const totalNotifications = (stats?.pendingReviews || 0) + (stats?.unreadMessages || 0);

  const topTabs: { label: string; page: AdminPage }[] = [
    { label: 'Dashboard', page: 'dashboard' },
    { label: 'News & Media', page: 'news' },
    { label: 'Heritage', page: 'heritage' },
    { label: 'Development', page: 'projects' },
    { label: 'Inquiries', page: 'contact' },
    { label: 'Users', page: 'users' },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-[#E8E4DA] dark:border-stone-800 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 transition-colors">
      {/* Left: Mobile Toggle, Brand & Global Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 max-w-xl">
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
        <div className="lg:hidden flex items-center gap-1.5 shrink-0">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#D4AF37]/60 shadow-xs bg-black flex items-center justify-center">
            <img
              src="/assets/aistudio/image_63748073.png"
              alt="Nkar Woo Làn"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Search trigger */}
        <button
          onClick={() => setSearchModalOpen(true)}
          className="flex items-center gap-2 sm:gap-2.5 w-full max-w-sm px-2.5 sm:px-3.5 py-2 text-xs text-stone-500 dark:text-stone-400 bg-[#F9F8F5] dark:bg-stone-800/80 hover:bg-[#F2EFE9] dark:hover:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-lg transition-colors group cursor-pointer text-left truncate"
          title="Press Command+K or click to search"
        >
          <Search className="w-4 h-4 text-[#8C8270] dark:text-stone-400 group-hover:text-[#153E2E] dark:group-hover:text-emerald-400 transition-colors shrink-0" />
          <span className="truncate hidden xs:inline sm:inline">Search articles, events, archives...</span>
          <span className="truncate inline xs:hidden sm:hidden">Search...</span>
          <kbd className="ml-auto hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-stone-500 dark:text-stone-400 bg-white dark:bg-stone-900 border border-[#DDD6C8] dark:border-stone-700 rounded">
            ⌘K
          </kbd>
        </button>

        {/* Quick Horizontal Nav Tabs (Desktop only) */}
        <nav className="hidden xl:flex items-center gap-1 border-l border-[#E8E4DA] dark:border-stone-800 pl-3">
          {topTabs.map((tab) => {
            const isActive = currentPage === tab.page;
            return (
              <button
                key={tab.page}
                onClick={() => setCurrentPage(tab.page)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#153E2E] dark:text-emerald-300 bg-[#EAF2EE] dark:bg-[#153E2E]/40 font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100/70 dark:hover:bg-stone-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Controls: Public Site Button, Theme Toggle, Role Simulator, Notifications, Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Visit Public Website Button */}
        <button
          onClick={() => setPublicPreviewOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FAF7F2] dark:bg-stone-800 hover:bg-[#F4EFE6] dark:hover:bg-stone-700 text-[#153E2E] dark:text-emerald-300 border border-[#E2DBD0] dark:border-stone-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          title="Visit Public Website"
        >
          <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Public Portal</span>
          <ExternalLink className="w-3 h-3 text-stone-400" />
        </button>

        {/* Theme Toggle Button (Light / Dark) */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:text-[#153E2E] dark:hover:text-[#D4AF37] hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#D4AF37]" />
          ) : (
            <Moon className="w-4 h-4 text-stone-600" />
          )}
        </button>

        {/* Role Simulator Dropdown (shadcn Base UI) */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 bg-[#FAF7F2] dark:bg-stone-800 hover:bg-[#F4EFE6] dark:hover:bg-stone-700 border border-[#E2DBD0] dark:border-stone-700 rounded-lg text-xs cursor-pointer transition-colors">
              <span className="text-[11px] text-stone-500 dark:text-stone-400 uppercase tracking-wider font-medium hidden sm:inline">Role:</span>
              <span
                className={`font-semibold inline-flex items-center gap-1 ${
                  currentUser.role === 'SUPER_ADMIN'
                    ? 'text-[#153E2E] dark:text-emerald-400'
                    : currentUser.role === 'CONTENT_REVIEWER'
                    ? 'text-[#A07010] dark:text-amber-400'
                    : 'text-stone-700 dark:text-stone-300'
                }`}
              >
                {currentUser.role === 'SUPER_ADMIN' && <Shield className="w-3.5 h-3.5 text-[#153E2E] dark:text-emerald-400" />}
                {currentUser.role === 'CONTENT_REVIEWER' && <UserCheck className="w-3.5 h-3.5 text-[#C69214] dark:text-amber-400" />}
                {currentUser.role === 'CONTENT_EDITOR' && <Edit3 className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />}
                <span className="hidden sm:inline">{currentUser.role.replace('_', ' ')}</span>
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64 bg-white dark:bg-stone-900 border border-[#E5E0D5] dark:border-stone-800 rounded-xl shadow-xl p-1.5">
            <DropdownMenuLabel className="px-2 py-1">
              <p className="text-[11px] font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">Switch Council Role</p>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 font-normal">Test RBAC enforcement across all views</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1 bg-[#E8E4DA] dark:bg-stone-800" />
            {INITIAL_USERS.map((user) => (
              <DropdownMenuItem
                key={user.id}
                onClick={() => switchRole(user.role)}
                className={`p-2 rounded-lg flex items-center gap-2.5 text-xs transition-colors cursor-pointer outline-none ${
                  currentUser.role === user.role
                    ? 'bg-[#EAF2EE] dark:bg-[#153E2E]/40 text-[#153E2E] dark:text-emerald-300 font-medium'
                    : 'hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-[#D4AF37]/30 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold truncate">{user.name}</span>
                  </div>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 block truncate">{user.role.replace('_', ' ')}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications Bell */}
        <button
          onClick={() => setNotificationDrawerOpen(!notificationDrawerOpen)}
          className="relative p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:text-[#153E2E] dark:hover:text-emerald-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          title="Notifications & Review Queue"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {totalNotifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D4AF37] rounded-full ring-2 ring-white dark:ring-stone-900 animate-pulse" />
          )}
        </button>

        {/* User Profile Menu (shadcn DropdownMenu) */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div
              className="flex items-center gap-2 pl-1.5 pr-1 py-1 rounded-lg hover:bg-stone-100/80 dark:hover:bg-stone-800 transition-colors cursor-pointer text-left"
              title="Administrator Account"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-[#D4AF37] shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="hidden md:block">
                <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 block leading-tight truncate max-w-[110px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400 block leading-tight">
                  {currentUser.role === 'SUPER_ADMIN' ? 'Super Admin' : currentUser.role === 'CONTENT_REVIEWER' ? 'Reviewer' : 'Editor'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden md:block" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-60 bg-white dark:bg-stone-900 border border-[#E5E0D5] dark:border-stone-800 rounded-xl shadow-xl p-1.5">
            <div className="p-2 border-b border-stone-100 dark:border-stone-800 mb-1">
              <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">{currentUser.name}</p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">{currentUser.email}</p>
              <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-bold bg-[#153E2E] dark:bg-emerald-800 text-white rounded">
                {currentUser.role.replace('_', ' ')}
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
              onClick={() => setPublicPreviewOpen(true)}
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
              onClick={() => setCurrentPage('settings')}
              className="p-2 rounded-lg text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer flex items-center gap-2 outline-none"
            >
              <Settings className="w-3.5 h-3.5 text-stone-500" />
              <span>Council Portal Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 bg-[#E8E4DA] dark:bg-stone-800" />

            <DropdownMenuItem
              onClick={() => setLogoutConfirmOpen(true)}
              className="p-2 rounded-lg text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer flex items-center gap-2 outline-none"
            >
              <LogOut className="w-3.5 h-3.5 text-red-500" />
              <span className="font-medium">Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
