'use server';

import { checkAuth } from '@/utils/actions/auth';

import { createClient } from '@/app/utils/supabase/server';

export async function checkEligibility(email: string): Promise<boolean> {
	try {
		const result = await checkAuth(email);
		const data = result;
		return data.isEligible;
	} catch (error) {
		console.error('Eligibility check error:', error);
		return false;
	}
}

export async function login(formData: FormData) {
	const supabase = await createClient();
	const email = formData.get('email') as string;

	const isEligible = await checkEligibility(email);

	if (!isEligible) {
		return {
			error: "You're not registered in EE6008. Please contact the course administrator.",
		};
	}

	const getBaseUrl = () => {
		if (process.env.NODE_ENV === 'development') {
			return `${process.env.NEXT_PUBLIC_SITE_URL}`;
		}

		return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
	};

	const { error } = await supabase.auth.signInWithOtp({
		email,
		options: {
			emailRedirectTo: getBaseUrl(),
			shouldCreateUser: true,
		},
	});

	if (error) {
		return { error: error.message };
	}

	return {
		success: `✓ Link sent! Check your email ${email} to sign in. The link will expire in 1 hour.`,
	};
}
