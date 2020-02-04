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
		id: "a019ea22-5194-4b83-8d31-0de0dc9bca53",
		email: "user.one@test.com",
		role: "student"
	},
	{
		id: "40f59aad-7473-4455-a3ea-1214f19b2565",
		email: "user.two@test.com",
		role: "student"
	}
];

export const GroupsMock: GroupDto[] = [
	{
		id: "b4f24e81-dfa4-4641-af80-8e34e02d9c4a",
		courseId: CoursesMock[0].id,
		name: "Testgroup 1",
		password: "password123",
		isClosed: false
	},
	{
		id: "73b2afad-7198-4f99-86dc-a2c46c03db2c",
		courseId: CoursesMock[0].id,
		name: "Testgroup 2",
		password: "password123",
		isClosed: false
	},
]

export const AssignmentsMock: AssignmentDto[] = [
	{
		id: "b2f6c008-b9f7-477f-9e8b-ff34ce339077",
		courseId: CoursesMock[0].id,
		name: "Test_Assignment 01 (Java)",
		maxPoints: 100,
		type: "homework"
	},
	{
		id: "74aa124c-0753-467f-8f52-48d1901282f8",
		courseId: CoursesMock[0].id,
		name: "Test_Assignment 02 (Java)",
		maxPoints: 100,
		type: "homework"
	}
]

export const AssessmentsMock: AssessmentDto[] = [
	{
		id: "8f60f844-4129-48a4-a625-7a74c7defd0d",
		assignmentId: AssignmentsMock[0].id,
		achievedPoints: 75,
		comment: "Test_Assessment #1 for TestAssignment 01"
	}, 
	{
		id: "ba56b749-6e65-4be8-aa55-33228433a897",
		assignmentId: AssignmentsMock[1].id,
		achievedPoints: 25,
		comment: "Test_Assessment #1 for TestAssignment 02"
	}
]