// app/layout.tsx
import { createClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { cookies, headers } from 'next/headers';

import { checkEligibility } from '@/utils/actions/auth';

import AppBreadcrumbs from '@/components/layout/app-breadcrumbs';
import AppHeader from '@/components/layout/app-header';
import AppSidebar from '@/components/layout/app-sidebar';
import { AuthProvider } from '@/components/layout/auth-provider';
import Background from '@/components/layout/background';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';

import './globals.css';
import Provider from './provider';

// --------------------
// 1) Font Definitions
// --------------------
const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
});

const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
});

// ---------------------
// 2) Export Page Metadata
// ---------------------
export const metadata: Metadata = { title: 'EE6008', description: 'EE6008 Application' };

// ----------------------------------------
// 3) Basic Layout (for unauthenticated or errors)
// ----------------------------------------
function BasicLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<Provider>
					<AuthProvider>{children}</AuthProvider>
				</Provider>
			</body>
		</html>
	);
}

// -----------------------------
// 4) Root Layout (entry point)
// -----------------------------
export default async function RootLayout({ children }: { children: React.ReactNode }) {
	// Get current path to check for auth pages
	const headersList = headers();
	const pathname = headersList.get('x-pathname') || headersList.get('x-url') || '';

	// Define auth-related pages that should always use BasicLayout
	const isAuthPage = pathname.includes('/signin') || pathname.includes('/unauthorized');

	// For auth pages, always use BasicLayout
	if (isAuthPage) {
		return <BasicLayout>{children}</BasicLayout>;
	}

	// Get session token from cookies
	const cookieStore = cookies();
	const accessToken = cookieStore.get('session-token')?.value;

	// If no token, render the basic layout
	if (!accessToken) {
		return <BasicLayout>{children}</BasicLayout>;
	}

	try {
		// Create Supabase client with the token
		const supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			{
				global: {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			}
		);

		// Verify user with token
		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();

		// If no user or error occurs, render the basic layout
		if (!user || userError) {
			console.error('Auth error in layout:', userError?.message);
			return <BasicLayout>{children}</BasicLayout>;
		}

		// Use the checkEligibility server action to get user role
		const userData = {
			email: user.email || '',
			name: user.email?.split('@')[0] || '',
			userId: user.id,
		};

		const data = await checkEligibility(userData, accessToken);
		const role = data.user.role;

		// Return the full layout if the user is verified
		return (
			<html lang="en">
				<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
					<Provider>
						<Background>
							<AuthProvider>
								<SidebarProvider>
									<AppSidebar role={role} />
									<SidebarInset className="w-full overflow-x-hidden">
										<header
											className="flex h-16 shrink-0 items-center gap-2 
                                
                                transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 fixed top-0 w-full backdrop-blur-sm justify-bet"
										>
											<div className="flex items-center gap-2 px-4">
												<SidebarTrigger className="-ml-1" />
												<Separator
													orientation="vertical"
													className="mr-2 h-4 bg-secondary-foreground/30"
												/>
												<AppBreadcrumbs />
											</div>
										</header>
										<AppHeader className="mt-16 mb-4 px-4" />
										<div className="px-4 pb-6 h-full w-full">{children}</div>
									</SidebarInset>
								</SidebarProvider>
							</AuthProvider>
						</Background>
						<Toaster />
					</Provider>
				</body>
			</html>
		);
	} catch (error) {
		console.error('Layout error:', error);
		// On error, fall back to the basic layout
		return (
			<AuthProvider>
				<BasicLayout>{children}</BasicLayout>
			</AuthProvider>
		);
	}
}
