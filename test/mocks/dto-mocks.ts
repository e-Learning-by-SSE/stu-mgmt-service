import { CourseDto } from "../../src/shared/dto/course.dto";
import { GroupDto } from "../../src/shared/dto/group.dto";
import { AssignmentDto } from "../../src/shared/dto/assignment.dto";
import { AssessmentDto } from "../../src/shared/dto/assessment.dto";
import { UserDto } from "../../src/shared/dto/user.dto";
import { UserRole, AssignmentState, AssignmentType, CollaborationType } from "../../src/shared/enums";

export const CoursesMock: CourseDto[] = [
	{ 
		id: "java-wise1920", 
		shortname: "java", 
		semester: "wise1920", 
		title: "Programmierpraktikum I: Java", 
		isClosed: false, 
		password: "java", 
		link: "test.test",
		allowGroups: true,
		maxGroupSize: 3
	},
	{ 
		id: "info2-sose2020", 
		shortname: "info2", 
		semester: "sose2020", 
		title: "Informatik II: Algorithmen und Datenstrukturen", 
		isClosed: true, 
		password: "info2", 
		link: "test.test",
		allowGroups: false,
		maxGroupSize: 0 
	},
	{ 
		id: "java-wise1819", 
		shortname: "java", 
		semester: "wise1819", 
		title: "Programmierpraktikum I: Java", 
		isClosed: true, 
		password: "java", 
		link: "test.test",
		allowGroups: true,
		maxGroupSize: 3
	},
]

export const UsersMock: UserDto[] = [
	{
		id: "a019ea22-5194-4b83-8d31-0de0dc9bca53",
		email: "user.one@test.com",
		username: "Max Mustermann",
		rzName: "mmustermann",
		role: UserRole.STUDENT
	},
	{
		id: "40f59aad-7473-4455-a3ea-1214f19b2565",
		email: "user.two@test.com",
		username: "Hans Peter",
		rzName: "hpeter",
		role: UserRole.STUDENT,
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
		isClosed: true
	},
]

export const AssignmentsMock: AssignmentDto[] = [
	{
		id: "b2f6c008-b9f7-477f-9e8b-ff34ce339077",
		courseId: CoursesMock[0].id,
		name: "Test_Assignment 01 (Java)",
		maxPoints: 100,
		type: AssignmentType.HOMEWORK,
		state: AssignmentState.IN_PROGRESS,
		collaborationType: CollaborationType.GROUP
	},
	{
		id: "74aa124c-0753-467f-8f52-48d1901282f8",
		courseId: CoursesMock[0].id,
		name: "Test_Assignment 02 (Java)",
		maxPoints: 100,
		type: AssignmentType.HOMEWORK,
		state: AssignmentState.CLOSED,
		collaborationType: CollaborationType.GROUP,
	},
	{
		id: "993b3cd0-6207-11ea-bc55-0242ac130003",
		courseId: CoursesMock[0].id,
		name: "Test_Assignment 03 (Java)",
		maxPoints: 100,
		type: AssignmentType.HOMEWORK,
		state: AssignmentState.IN_REVIEW,
		collaborationType: CollaborationType.SINGLE,
	},
	{
		id: "c2bc4aa4-6207-11ea-bc55-0242ac130003",
		courseId: CoursesMock[0].id,
		name: "Test_Assignment 04 (Java)",
		maxPoints: 100,
		type: AssignmentType.HOMEWORK,
		state: AssignmentState.EVALUATED,
		collaborationType: CollaborationType.GROUP_OR_SINGLE,
	},
	{
		id: "8ffc9608-4c3d-4fca-b4fc-3768822d6c0d",
		courseId: CoursesMock[0].id,
		name: "Test_Assignment 05 (Java) Invisible",
		maxPoints: 100,
		type: AssignmentType.HOMEWORK,
		state: AssignmentState.INVISIBLE,
		collaborationType: CollaborationType.GROUP_OR_SINGLE,
	}
]

export const AssessmentsMock: AssessmentDto[] = [
	{
		id: "8f60f844-4129-48a4-a625-7a74c7defd0d",
		assignmentId: AssignmentsMock[0].id,
		achievedPoints: 75,
		comment: "Test_Assessment #1 for TestAssignment 01 (Group-Assessment)",
		groupId: GroupsMock[0].id
	}, 
	{
		id: "ba56b749-6e65-4be8-aa55-33228433a897",
		assignmentId: AssignmentsMock[1].id,
		achievedPoints: 25,
		comment: "Test_Assessment #1 for TestAssignment 02 (User-Assessment)",
		userId: UsersMock[0].id
	}
]

export const CourseUserRelationsMock = [
	{
		id: 1,
		courseId: CoursesMock[0].id,
		userId: UsersMock[0].id,
		role: UserRole.STUDENT
	},
	{
		id: 2,
		courseId: CoursesMock[0].id,
		userId: UsersMock[1].id,
		role: UserRole.STUDENT
	}
]

export const AssessmentUserRelationsMock = [
	{
		id: 1,
		assessmentId: AssessmentsMock[1].id,
		userId: UsersMock[0].id
	}
]

export const UserGroupRelationsMock = [
	{
		id: 1,
		userId: UsersMock[0].id,
		groupId: GroupsMock[0].id
	},
	{
		id: 2,
		userId: UsersMock[1].id,
		groupId: GroupsMock[0].id
	}

]
