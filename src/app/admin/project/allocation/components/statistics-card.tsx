import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { GeneratedAllocationData } from '../types';
import { PreferenceDistributionChart } from './preference-distribution-chart';

type StatisticsCardsProps = {
	data: GeneratedAllocationData | null;
	isGenerating: boolean;
};

export function StatisticsCards({ data, isGenerating }: StatisticsCardsProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<Card>
				<CardHeader>
					<CardTitle>Allocation Statistics</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div>
							<p className="text-sm text-muted-foreground">Student Allocation Rate</p>
							<p className="text-2xl font-bold">
								{isGenerating || !data
									? '...'
									: `${data.result?.allocationRate.toFixed(2)}%`}
							</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Average Preference Score
							</p>
							<p className="text-2xl font-bold">
								{isGenerating || !data
									? '...'
									: data.result?.averagePreference.toFixed(2)}
							</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Dropped Projects</p>
							<p className="text-2xl font-bold">
								{isGenerating || !data
									? '...'
									: data.result?.droppedProjects.length}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<PreferenceDistributionChart
				data={data?.result?.preferenceDistribution ?? {}}
				isGenerating={isGenerating}
			/>
		</div>
	);
}
