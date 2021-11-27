import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { getConnection } from "typeorm";
import { AssignmentDto } from "../../src/course/dto/assignment/assignment.dto";
import { createApplication } from "../mocks/application.mock";
import {
	ASSIGNMENT_JAVA_CLOSED,
	ASSIGNMENT_JAVA_IN_PROGRESS_HOMEWORK_GROUP,
	ASSIGNMENT_JAVA_IN_REVIEW_SINGLE,
	ASSIGNMENTS_ALL,
	ASSIGNMENTS_JAVA_1920
} from "../mocks/assignments.mock";
import { COURSE_JAVA_1920 } from "../mocks/courses.mock";
import { DbMockService } from "../mocks/db-mock.service";

let app: INestApplication;
let dbMockService: DbMockService;

const course = COURSE_JAVA_1920; // the course that will be used for testing

describe("GET-REQUESTS of AssignmentController (e2e)", () => {
	beforeAll(async () => {
		app = await createApplication();

		// Setup mocks
		dbMockService = new DbMockService(getConnection());
		await dbMockService.createAll();
	});

	afterAll(async () => {
		await getConnection().dropDatabase(); // Drop database with all tables and data
		await getConnection().close(); // Close Db-Connection after all tests have been executed
	});

	it("(GET) /courses/{courseId}/assignments Retrieves all assignments of a course", () => {
		const expected = ASSIGNMENTS_JAVA_1920.length;
		console.assert(expected > 1, "There should be multiple assignments");

		return request(app.getHttpServer())
			.get(`/courses/${course.id}/assignments`)
			.expect(({ body }) => {
				const result = body as AssignmentDto[];
				expect(result.length).toEqual(expected);
				expect(result).toMatchSnapshot();
			});
	});

	describe("(GET) /courses/{courseId}/assignments/{assignmentId} Retrieves the assignment", () => {
		it("Without configs and links", () => {
			const assignment = ASSIGNMENT_JAVA_IN_REVIEW_SINGLE;

			return request(app.getHttpServer())
				.get(`/courses/${course.id}/assignments/${assignment.id}`)
				.expect(({ body }) => {
					const result = body as AssignmentDto;
					expect(result.id).toEqual(assignment.id);
					expect(result.links).toEqual(undefined);
					expect(result.configs).toEqual(undefined);
					expect(result).toMatchSnapshot();
				});
		});

		it("With configs and links", () => {
			const assignment = ASSIGNMENT_JAVA_IN_PROGRESS_HOMEWORK_GROUP;

			return request(app.getHttpServer())
				.get(`/courses/${course.id}/assignments/${assignment.id}`)
				.expect(({ body }) => {
					const result = body as AssignmentDto;
					expect(result.id).toEqual(assignment.id);
					expect(result.links).toEqual(assignment.links);
					expect(result.configs).toEqual(assignment.configs);
					expect(result).toMatchSnapshot();
				});
		});
	});
});

describe("POST-REQUESTS of AssignmentController (e2e)", () => {
	beforeEach(async () => {
		app = await createApplication();

		// Setup mocks
		dbMockService = new DbMockService(getConnection());
		await dbMockService.createCourses();
		await dbMockService.createCourseConfig();
		await dbMockService.createGroupSettings();
		await dbMockService.createUsers();
		await dbMockService.createParticipants();
	});

	afterEach(async () => {
		await getConnection().dropDatabase(); // Drop database with all tables and data
		await getConnection().close(); // Close Db-Connection after all tests have been executed
	});

	it("(POST) /courses/{courseId}/assignments Creates the given assignment and returns it", () => {
		const assignment = ASSIGNMENT_JAVA_IN_PROGRESS_HOMEWORK_GROUP;

		return request(app.getHttpServer())
			.post(`/courses/${course.id}/assignments`)
			.send(assignment)
			.expect(201)
			.expect(({ body }) => {
				const result = body as AssignmentDto;
				result.id = "assignment-id-replacement";
				expect(result).toMatchSnapshot();
			});
	});
});

describe("PATCH-REQUESTS of AssignmentController (e2e)", () => {
	beforeEach(async () => {
		app = await createApplication();

		// Setup mocks
		dbMockService = new DbMockService(getConnection());
		await dbMockService.createAll();
	});

	afterEach(async () => {
		await getConnection().dropDatabase(); // Drop database with all tables and data
		await getConnection().close(); // Close Db-Connection after all tests have been executed
	});

	it("(PATCH) /courses/{courseId}/assignments/{assignmentId} Updates the assignment", () => {
		const assignment = ASSIGNMENT_JAVA_IN_PROGRESS_HOMEWORK_GROUP;

		// Create clone of original data and perform some changes
		const changedAssignment = new AssignmentDto();
		Object.assign(changedAssignment, assignment);

		changedAssignment.name = "new name";
		changedAssignment.points = 1000;
		changedAssignment.comment = "new comment";

		expect(assignment.configs?.length).toBeGreaterThan(0);
		changedAssignment.configs = null;

		expect(assignment.links?.length).toBeGreaterThan(0);
		changedAssignment.links = null;

		return request(app.getHttpServer())
			.patch(`/courses/${course.id}/assignments/${assignment.id}`)
			.send(changedAssignment)
			.expect(({ body }) => {
				const result = body as AssignmentDto;
				expect(result.id).toEqual(assignment.id);
				expect(result.name).toEqual(changedAssignment.name);
				expect(result.points).toEqual(changedAssignment.points);
				expect(result.comment).toEqual(changedAssignment.comment);
				expect(result.configs).toEqual(undefined);
				expect(result.links).toEqual(undefined);
				expect(result).toMatchSnapshot();
			});
	});
});

describe("DELETE-REQUESTS of AssignmentController (e2e)", () => {
	beforeEach(async () => {
		app = await createApplication();

		// Setup mocks
		dbMockService = new DbMockService(getConnection());
		await dbMockService.createAll();
	});

	afterEach(async () => {
		await getConnection().dropDatabase(); // Drop database with all tables and data
		await getConnection().close(); // Close Db-Connection after all tests have been executed
	});

	it("(DELETE) /courses/{courseId}/assignments/{assignmentId} Deletes the assignment", () => {
		const assignment = ASSIGNMENT_JAVA_CLOSED;

		return request(app.getHttpServer())
			.delete(`/courses/${course.id}/assignments/${assignment.id}`)
			.expect(200);
	});
});
