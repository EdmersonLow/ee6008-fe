// utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
	return createBrowserClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
		auth: {
			autoRefreshToken: true,
			persistSession: true,
			detectSessionInUrl: true,
		},
	});
}
