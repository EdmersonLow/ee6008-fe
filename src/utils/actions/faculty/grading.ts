'use server';

import { fetcherFn } from '@/utils/functions';

// Interfaces for grading components
export interface GradingComponent {
	isTeamBased: boolean;
	id: number;
	name: string;
	description: string;
	weight: number;
	max_score: number;
	component_type: string;
	is_team_based?: boolean;
}

// Interface for supervisor grading
export interface SupervisorGrade {
	project_id: number;
	student_id?: number;
	component_id: number;
	score: number;
	feedback?: string;
}

// Interface for team grading
export interface TeamGrade {
	component_id: number;
	score: number;
	comments?: string;
}

// Interface for student grading
export interface StudentGrade {
	student_id: number;
	component_id: number;
	score: number;
	comments?: string;
}

// Interface for moderator grading
export interface ModeratorGrade {
	project_id: number;
	component_id: number;
	score: number;
	feedback?: string;
}

// Interface for project grades
export interface ProjectGrade {
	is_locked: boolean | undefined;
	project_id: number;
	student_id?: number;
	component_id: number;
	component_name: string;
	component_weight: number;
	score: number;
	max_score: number;
	feedback?: string;
	graded_by: string;
	graded_at: string;
	gradingCompleted?: boolean;
}

// Interface for final project grades
export interface FinalProjectGrade {
	project_id: number;
	student_id?: number;
	student_name?: string;
	final_score: number;
	supervisor_score: number;
	moderator_score: number;
	grade: string;
}

// Interface for supervisor grade update
export interface SupervisorGradeUpdate {
	component_id: number;
	student_id?: number; // Optional: null for team grades
	score: number;
	comments?: string;
}

// Interface for moderator grade update
export interface ModeratorGradeUpdate {
	component_id: number;
	score: number;
	comments?: string;
}

/**
 * Get grading components for supervisor
 */
export async function getGradingComponentsForSupervisor(): Promise<GradingComponent[]> {
	return fetcherFn<GradingComponent[]>('faculty/grading/components/supervisor', {
		method: 'GET',
		cache: 'no-store',
	});
}

/**
 * Get grading components for moderator
 */
export async function getGradingComponentsForModerator(): Promise<GradingComponent[]> {
	return fetcherFn<GradingComponent[]>('faculty/grading/components/moderator', {
		method: 'GET',
		cache: 'no-store',
	});
}

/**
 * Get project grades as supervisor
 */
export async function getProjectGradesAsSupervisor(projectId: number): Promise<ProjectGrade[]> {
	return fetcherFn<ProjectGrade[]>(`faculty/projects/${projectId}/supervisor/grade`, {
		method: 'GET',
		cache: 'no-store',
	});
}

/**
 * Get project grades as moderator
 */
export async function getProjectGradesAsModerator(projectId: number): Promise<ProjectGrade[]> {
	return fetcherFn<ProjectGrade[]>(`faculty/projects/${projectId}/moderator/grade`, {
		method: 'GET',
		cache: 'no-store',
	});
}

/**
 * Get final project grades
 */
export async function getFinalProjectGrades(projectId: number): Promise<FinalProjectGrade[]> {
	return fetcherFn<FinalProjectGrade[]>(`faculty/projects/${projectId}/grades`, {
		method: 'GET',
		cache: 'no-store',
	});
}

/**
 * Grade project as supervisor
 */
export async function gradeProjectAsSupervisor(
	projectId: number,
	grades: SupervisorGrade[],
	feedback?: string
): Promise<boolean> {
	await fetcherFn(
		`faculty/projects/${projectId}/supervisor/grade`,
		{
			method: 'POST',
		},
		{
			grades,
			feedback,
		}
	);

	return true;
}

/**
 * Grade project as moderator
 */
export async function gradeProjectAsModerator(
	projectId: number,
	grades: ModeratorGrade[],
	feedback?: string
): Promise<boolean> {
	await fetcherFn(
		`faculty/projects/${projectId}/moderator/grade`,
		{
			method: 'POST',
		},
		{
			grades,
			feedback,
		}
	);

	return true;
}

/**
 * Update specific grade components for supervisor
 */
export async function updateSupervisorGradeComponents(
	projectId: number,
	updates: SupervisorGradeUpdate[]
): Promise<boolean> {
	const response = await fetcherFn<{ success: boolean }>(
		`faculty/projects/${projectId}/grade/supervisor`,
		{
			method: 'PATCH',
			cache: 'no-store',
		},
		{ updates }
	);

	return response.success;
}

/**
 * Update specific grade components for moderator
 */
export async function updateModeratorGradeComponents(
	projectId: number,
	updates: ModeratorGradeUpdate[],
	feedback?: string
): Promise<boolean> {
	const response = await fetcherFn<{ success: boolean }>(
		`faculty/projects/${projectId}/grade/moderator`,
		{
			method: 'PATCH',
			cache: 'no-store',
		},
		{ updates, feedback }
	);

	return response.success;
}

/**
 * Client-side functions
 */

export async function getGradingComponentsForSupervisorClient(): Promise<GradingComponent[]> {
	return fetcherFn<GradingComponent[]>('faculty/grading/components/supervisor', {
		method: 'GET',
	});
}

export async function getGradingComponentsForModeratorClient(): Promise<GradingComponent[]> {
	return fetcherFn<GradingComponent[]>('faculty/grading/components/moderator', {
		method: 'GET',
	});
}

export async function getProjectGradesAsSupervisorClient(
	projectId: number
): Promise<ProjectGrade[]> {
	return fetcherFn<ProjectGrade[]>(`faculty/projects/${projectId}/supervisor/grade`, {
		method: 'GET',
	});
}

export async function getProjectGradesAsModeratorClient(
	projectId: number
): Promise<ProjectGrade[]> {
	return fetcherFn<ProjectGrade[]>(`faculty/projects/${projectId}/moderator/grade`, {
		method: 'GET',
	});
}

export async function getFinalProjectGradesClient(projectId: number): Promise<FinalProjectGrade[]> {
	console.log(`Fetching final project grades for project ID: ${projectId}`);
	try {
		const result = await fetcherFn<FinalProjectGrade[]>(
			`faculty/projects/${projectId}/grades`,
			{
				method: 'GET',
			}
		);

		console.log('Final project grades API response:', JSON.stringify(result, null, 2));
		console.log(
			'Number of grade records:',
			Array.isArray(result) ? result.length : 'Not an array'
		);

		if (Array.isArray(result) && result.length > 0) {
			console.log('First grade record structure:', JSON.stringify(result[0], null, 2));
			console.log('Grade data types:', {
				project_id: typeof result[0].project_id,
				student_id: typeof result[0].student_id,
				student_name: typeof result[0].student_name,
				final_score: typeof result[0].final_score,
				supervisor_score: typeof result[0].supervisor_score,
				moderator_score: typeof result[0].moderator_score,
				grade: typeof result[0].grade,
			});
		}

		return result;
	} catch (error) {
		console.error('Error fetching final project grades:', error);
		throw error;
	}
}

export async function gradeProjectAsSupervisorClient(
	projectId: number,
	grades: {
		student_grades: SupervisorGrade[];
		team_grades: SupervisorGrade[];
	},
	feedback?: string
): Promise<boolean> {
	console.log('gradeProjectAsSupervisorClient - POST request payload:', {
		projectId,
		...grades,
		feedback,
	});

	await fetcherFn(
		`faculty/projects/${projectId}/supervisor/grade`,
		{
			method: 'POST',
		},
		{
			...grades,
			feedback,
		}
	);

	return true;
}

export async function gradeProjectAsModeratorClient(
	projectId: number,
	grades: {
		team_grades: ModeratorGrade[];
	},
	feedback?: string
): Promise<boolean> {
	console.log('gradeProjectAsModeratorClient - POST request payload:', {
		projectId,
		...grades,
		feedback,
	});

	await fetcherFn(
		`faculty/projects/${projectId}/moderator/grade`,
		{
			method: 'POST',
		},
		{
			...grades,
			feedback,
		}
	);

	return true;
}

/**
 * Update specific grade components for supervisor (client)
 */
export async function updateSupervisorGradeComponentsClient(
	projectId: number,
	updates: SupervisorGradeUpdate[]
): Promise<boolean> {
	try {
		return await updateSupervisorGradeComponents(projectId, updates);
	} catch (error) {
		console.error('Error updating supervisor grade components:', error);
		throw error;
	}
}

/**
 * Update specific grade components for moderator (client)
 */
export async function updateModeratorGradeComponentsClient(
	projectId: number,
	updates: ModeratorGradeUpdate[],
	feedback?: string
): Promise<boolean> {
	try {
		return await updateModeratorGradeComponents(projectId, updates, feedback);
	} catch (error) {
		console.error('Error updating moderator grade components:', error);
		throw error;
	}
}
