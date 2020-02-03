import { CourseDto } from "./course.dto";

export class AssignmentDto {
	id?: string;
	courseId: string;
	name: string;
	type: string;
	maxPoints: number;
	comment?: string;
	link?: string;
}