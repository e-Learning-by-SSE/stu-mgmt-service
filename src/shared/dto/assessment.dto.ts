export class AssessmentDto {
	id?: string;
	assignmentId: string;
	achievedPoints: number;
	comment?: string;
	groupId?: string; // Assessment should apply to a group
	userId?: string; // Assessment should apply to a single user
}