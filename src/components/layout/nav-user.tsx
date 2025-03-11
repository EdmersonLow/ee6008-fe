'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
	BadgeCheck,
	Bell,
	ChevronsUpDown,
	CreditCard,
	LogOut,
	MoonIcon,
	SunIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';

// Helper function for direct cookie access - prevent duplication
function getCookieValue(name: string): string {
	if (typeof document === 'undefined') return '';

	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) {
		const cookieValue = parts.pop()?.split(';').shift();
		return cookieValue ? decodeURIComponent(cookieValue) : '';
	}
	return '';
}

// Define interface for the user object
interface UserInfo {
	name: string;
	email: string;
	avatar: string;
	role: string;
}

export default function NavUser({ user }: { user: UserInfo }) {
	const { isMobile } = useSidebar();
	const { systemTheme, theme, setTheme } = useTheme();
	const currentTheme = theme === 'system' ? systemTheme : theme;
	const router = useRouter();
	const supabase = createClientComponentClient();
	const [mounted, setMounted] = useState(false);
	const [directUser, setDirectUser] = useState<{
		name: string;
		email: string;
		avatar: string;
		role: string;
	} | null>(null);

	// Set mounted flag to prevent hydration errors
	useEffect(() => {
		setMounted(true);
	}, []);

	// Direct cookie access as a fallback
	useEffect(() => {
		if (!mounted) return; // Skip during SSR

		try {
			// Get cookies directly
			const cookieName = getCookieValue('user-name');
			const cookieEmail = getCookieValue('user-email');
			const cookieRole = getCookieValue('user-role');

			if (cookieName || cookieEmail) {
				setDirectUser({
					name: cookieName || user.name,
					email: cookieEmail || user.email,
					role: cookieRole || user.role,
					avatar: user.avatar,
				});
				console.log('📱 NavUser direct cookie check:', {
					cookieName,
					cookieEmail,
					cookieRole,
				});
			}
		} catch (e) {
			console.error('Error in NavUser cookie check:', e);
		}
	}, [mounted, user]);

	// Skip rendering proper content during SSR to prevent hydration errors
	if (!mounted) {
		return (
			<SidebarMenu>
				<SidebarMenuItem className={isMobile ? 'w-full' : ''}>
					<SidebarMenuButton size="lg" className="justify-between w-full">
						<div className="flex items-center gap-2 truncate">
							<Avatar className="h-5 w-5">
								<AvatarFallback className="text-xs">U</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 gap-px truncate text-left text-xs leading-none">
								<span className="truncate font-semibold">User</span>
								<span className="truncate opacity-60"></span>
							</div>
						</div>
						<ChevronsUpDown className="size-3 shrink-0 opacity-50" />
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		);
	}

	// Use direct cookie values if available, or fall back to passed props
	const displayUser = directUser || user;

	console.log('🔄 User:', displayUser);
	console.log('🔄 Theme:', currentTheme);

	return (
		<SidebarMenu>
			<SidebarMenuItem className={isMobile ? 'w-full' : ''}>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton size="lg" className="justify-between w-full">
							<div className="flex items-center gap-2 truncate">
								<Avatar className="h-5 w-5">
									<AvatarImage src={displayUser.avatar} />
									<AvatarFallback className="text-xs">
										{displayUser.name?.charAt(0) || 'U'}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 gap-px truncate text-left text-xs leading-none">
									<span className="truncate font-semibold">
										{displayUser.name || 'User'}
									</span>
									<span className="truncate opacity-60">{displayUser.email}</span>
								</div>
							</div>
							<ChevronsUpDown className="size-3 shrink-0 opacity-50" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent side="top" sideOffset={20} className="w-56">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<BadgeCheck className="mr-2 h-4 w-4 text-blue-500" />
								<span>Verified</span>
								{displayUser.role === 'admin' && (
									<span className="ml-auto rounded bg-red-500 px-1.5 text-[0.625rem] font-medium uppercase text-white">
										Admin
									</span>
								)}
								{displayUser.role === 'faculty' && (
									<span className="ml-auto rounded bg-orange-500 px-1.5 text-[0.625rem] font-medium uppercase text-white">
										Faculty
									</span>
								)}
								{displayUser.role === 'student' && (
									<span className="ml-auto rounded bg-green-500 px-1.5 text-[0.625rem] font-medium uppercase text-white">
										Student
									</span>
								)}
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => router.push('/settings')}>
								<CreditCard className="mr-2 h-4 w-4" />
								<span>Account settings</span>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => router.push('/notifications')}>
								<Bell className="mr-2 h-4 w-4" />
								<span>Notifications</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem onClick={() => setTheme('light')}>
								<SunIcon className="mr-2 h-4 w-4" />
								<span>Light</span>
								{currentTheme === 'light' && (
									<span className="ml-auto rounded-full bg-black px-1.5 text-[0.625rem] font-medium uppercase text-white">
										ON
									</span>
								)}
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme('dark')}>
								<MoonIcon className="mr-2 h-4 w-4" />
								<span>Dark</span>
								{currentTheme === 'dark' && (
									<span className="ml-auto rounded-full bg-black px-1.5 text-[0.625rem] font-medium uppercase text-white">
										ON
									</span>
								)}
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={async () => {
								try {
									// First sign out from Supabase auth
									await supabase.auth.signOut();

									// Manually clear all cookies we set in middleware
									document.cookie =
										'session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
									document.cookie =
										'user-role=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
									document.cookie =
										'user-id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
									document.cookie =
										'user-name=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
									document.cookie =
										'user-email=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

									// Clear session storage
									if (typeof window !== 'undefined') {
										sessionStorage.removeItem('ee6008_user_session_data');
										sessionStorage.removeItem('ee6008_prev_user_name');
										sessionStorage.removeItem('ee6008_prev_user_email');
										sessionStorage.removeItem('hasRenderedSidebar');

										// Also clear local storage items
										localStorage.removeItem('ee6008_user_data');
									}

									console.log(
										'🔐 Sign out successful - redirecting to signin page'
									);
									// Force reload to clear any cached state
									window.location.href = '/signin';
								} catch (error) {
									console.error('Error signing out:', error);
								}
							}}
						>
							<LogOut className="mr-2 h-4 w-4" />
							<span>Sign out</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
