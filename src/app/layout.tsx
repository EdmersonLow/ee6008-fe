import type { Metadata } from 'next';
import localFont from 'next/font/local';

import { AppSidebar } from '@/components/app-sidebar';
import Background from '@/components/background';
import { ThemeProvider } from '@/components/theme-provider';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

import './globals.css';

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

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// TODO: use dynamic roles (options: 'student', 'faculty', 'admin')
	const role = 'student';

	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Background>
						<SidebarProvider>
							<AppSidebar role={role} />
							<SidebarInset>
								<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 fixed top-0 w-full backdrop-blur-sm">
									<div className="flex items-center gap-2 px-4">
										<SidebarTrigger className="-ml-1" />
										<Separator
											orientation="vertical"
											className="mr-2 h-4 bg-secondary-foreground/30"
										/>
										<span className="capitalize font-medium text-sm">
											{role}
										</span>
									</div>
								</header>
								{children}
							</SidebarInset>
						</SidebarProvider>
					</Background>
				</ThemeProvider>
			</body>
		</html>
	);
}
