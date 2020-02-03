import { CourseDto } from "../../src/shared/dto/course.dto";
import { GroupDto } from "../../src/shared/dto/group.dto";
import { AssignmentDto } from "../../src/shared/dto/assignment.dto";
import { AssessmentDto } from "../../src/shared/dto/assessment.dto";
import { UserDto } from "../../src/shared/dto/user.dto";

export const CoursesMock: CourseDto[] = [
	{ 
		id: "java-wise1920", 
		shortname: "java", 
		semester: "wise1920", 
		title: "Programmierpraktikum I: Java", 
		isClosed: false, 
		password: "java", 
		link: "test.test" 
	},
	{ 
		id: "info2-sose2020", 
		shortname: "info2", 
		semester: "sose2020", 
		title: "Informatik II: Algorithmen und Datenstrukturen", 
		isClosed: true, 
		password: "info2", 
		link: "test.test" 
	},
]

export const UsersMock: UserDto[] = [
	{
		email: "user.one@test.com",
		role: "student"
	},
	{
		email: "user.two@test.com",
		role: "student"
	}
];

export const GroupsMock: GroupDto[] = [
	{
		name: "Testgroup 1",
		courseId: CoursesMock[0].id
	},
	{
		name: "Testgroup 2",
		courseId: CoursesMock[0].id
	},
]

export const AssignmentsMock: AssignmentDto[] = [
	{
		courseId: CoursesMock[0].id,
		name: "Test_Assignment 01",
		maxPoints: 100,
		type: "homework"
	},
	{
		courseId: CoursesMock[0].id,
		name: "Test_Assignment 02",
		maxPoints: 100,
		type: "homework"
	}
]

export const AssessmentsMock: AssessmentDto[] = [
	{
		assignmentId: "Insert AssignmentId of Test_Assignment 01",
		achievedPoints: 75,
		comment: "Test_Assessment #1 for TestAssignment 01"
	}, 
	{
		assignmentId: "Insert AssignmentId of Test_Assignment 02",
		achievedPoints: 25,
		comment: "Test_Assessment #1 for TestAssignment 02"
	}
]