'use server';

import { createClient } from '@/app/utils/supabase/server';

export async function checkEligibility(email: string): Promise<boolean> {
	try {
		const response = await fetch(`${process.env.BACKEND_API_URL}/auth/check`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email }),
		});

		if (!response.ok) {
			throw new Error('Failed to check eligibility');
		}

		const data = await response.json();
		return data.isEligible;
	} catch (error) {
		console.error('Eligibility check error:', error);
		return false;
	}
}

export async function login(formData: FormData) {
	const supabase = await createClient();
	const email = formData.get('email') as string;

	// Check eligibility before sending magic link
	const isEligible = await checkEligibility(email);

	if (!isEligible) {
		return {
			error: "You're not registered in EE6008. Please contact the course administrator.",
		};
	}

	const { error } = await supabase.auth.signInWithOtp({
		email,
		options: {
			emailRedirectTo: `${process.env.SITE_URL}/auth/callback`,
			shouldCreateUser: true,
		},
	});

	if (error) {
		return { error: error.message };
	}

	return {
		success: `✓Link sent! Check your email ${email} to sign in. The link will expire in 1 hour.`,
	};
}
