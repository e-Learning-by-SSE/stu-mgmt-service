import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getConnection } from 'typeorm';
import { DbMockService } from "./mocks/db-mock.service";
import { AssessmentDto } from "../src/shared/dto/assessment.dto";
import { AssignmentDto } from "../src/shared/dto/assignment.dto";
import { GroupDto } from "../src/shared/dto/group.dto";
import { CourseDto } from "../src/shared/dto/course.dto";

let courses: CourseDto[];
let groups: GroupDto[];
let assignments: AssignmentDto[];
let assessments: AssessmentDto[];

describe('GET-REQUESTS of CourseController (e2e)', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		// Setup mocks
		const dbMockService = new DbMockService(getConnection());
		courses = dbMockService.courses;
		groups = dbMockService.groups;
		assignments = dbMockService.assignments;
		assessments = dbMockService.assessments;
		await dbMockService.createAll();
	});

	afterAll(async () => {
		await getConnection().dropDatabase(); // Drop database with all tables and data
		await getConnection().close(); // Close Db-Connection after all tests have been executed
	});

	it("(GET) /courses Retrieves all courses", () => {
		return request(app.getHttpServer())
			.get("/courses")
			.expect(({ body }) => {
				expect(body.length).toEqual(courses.length);
			});
	});

	it("(GET) /courses/{courseId} Retrieves the course", () => {
		return request(app.getHttpServer())
			.get("/courses/"+ courses[0].id)
			.expect(({ body }) => {
				expect(body.id).toEqual(courses[0].id); 
			});
	});

	it("(GET) /courses/{courseId}/groups Retrieves all groups of a course", () => {
		return request(app.getHttpServer())
			.get("/courses/" + courses[0].id +"/groups")
			.expect(({ body }) => {
				expect(body.length).toEqual(groups.length); 
			});
	});

	it("(GET) /courses/{courseId}/assignments Retrieves all assignments of a course", () => {
		return request(app.getHttpServer())
			.get("/courses/" + courses[0].id + "/assignments")
			.expect(({ body }) => {
				expect(body.length).toEqual(assignments.length); 
			});
	});

	// SKIP: Not implemented
	it.skip("(GET) /courses/{courseId}/assignments/{assignmentId} Retrieves the assignment", () => {
		return request(app.getHttpServer())
			.get("/courses/" + courses[0].id + "/assignments/" + assignments[0].id)
			.expect(({ body }) => {
				expect(body.id).toEqual(assignments[0].id); 
			});
	});

	it("(GET) /courses/{courseId}/assignments/{assignmentId}/assessments Retrieves all assessments for the assignment", () => {
		return request(app.getHttpServer())
			.get("/courses/" + courses[0].id + "/assignments/" + assignments[0].id + "/assessments")
			.expect(({ body }) => {
				expect(body.length).toEqual(1); // There is only one assessment for this assignment
			});
	});

	// SKIP: Not implemented
	it.skip("(GET) /courses/{courseId}/assignment/{assignmentId}/assessments/{assessmentId} Retrieves the assessment", () => {
		return request(app.getHttpServer())
		.get("/courses/assignments/" + assignments[0].id + "/assessments/"+ assessments[0].id)
		.expect(({ body }) => {
			expect(body.id).toEqual(assessments[0].id); 
		});
	});

});

describe('POST-REQUEST of CourseController (e2e)', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		// Setup mocks - For the POST-Tests, we don't need to create anything
		const dbMockService = new DbMockService(getConnection());
		courses = dbMockService.courses;
		groups = dbMockService.groups;
		assignments = dbMockService.assignments;
		assessments = dbMockService.assessments;
	});

	afterAll(async () => {
		await getConnection().dropDatabase(); // Drop database with all tables and data
		await getConnection().close(); // Close Db-Connection after all tests have been executed
	});

	it("(POST) /courses Creates the given course and returns it (Part 1/2)", () => {
		return request(app.getHttpServer())
			.post("/courses")
			.send(courses[0])
			.expect(201)
			.expect(({ body }) => {
				expect(body.shortname).toEqual(courses[0].shortname); // Can't compare entire objects, because property "password" is not sent to clients
			})
	});

	it("(POST) /courses Creates the given course returns it (Part 2/2)", () => {
		return request(app.getHttpServer())
			.post("/courses")
			.send(courses[1])
			.expect(201)
			.expect(({ body }) => {
				expect(body.shortname).toEqual(courses[1].shortname); // Can't compare entire objects, because property "password" is not sent to clients
			})
	});

	it("(POST) /courses/{courseId}/groups Creates the given group and returns it (Part 1/2)", () => {
		return request(app.getHttpServer())
			.post("/courses/" + courses[0].id + "/groups")
			.send(groups[0]) // CourseId does not need to be specified here, because Course was created with given Id
			.expect(201)
			.expect(({ body }) => {
				expect(body.courseId).toEqual(groups[0].courseId);
				expect(body.name).toEqual(groups[0].name);
			})
	});

	it("(POST) /courses/{courseId}/groups Creates the given group and returns it (Part 2/2)", () => {
		return request(app.getHttpServer())
			.post("/courses/"  + courses[0].id + "/groups")
			.send(groups[1]) // CourseId does not need to be specified here, because Course was created with given Id
			.expect(201)
			.expect(({ body }) => {
				expect(body.courseId).toEqual(groups[1].courseId);
				expect(body.name).toEqual(groups[1].name);
			})
	});

	it("(POST) /courses/{courseId}/assignments Creates the given assignment and returns it", () => {
		return request(app.getHttpServer())
			.post("/courses/" + courses[0].id + "/assignments")
			.send(assignments[0]) // CourseId does not need to be specified here, because Course was created with given Id
			.expect(201)
			.expect(({ body }) => {
				expect(body.courseId).toEqual(assignments[0].courseId);
				expect(body.name).toEqual(assignments[0].name);
				expect(body.type).toEqual(assignments[0].type);
				expect(body.maxPoints).toEqual(assignments[0].maxPoints);
			});
	});

	it("(POST) /courses/{courseId}/assignments/{assignmentId}/assessments Creates the given assessment and returns it #", () => {
		return request(app.getHttpServer())
			.post("/courses/" + courses[0].id + "/assignments/" + assignments[0].id + "/assessments")
			.send(assessments[0])
			.expect(201)
			.expect(({ body }) => {
				expect(body.assignmentId).toEqual(assessments[0].assignmentId);
				expect(body.achievedPoints).toEqual(assessments[0].achievedPoints);
				expect(body.comment).toEqual(assessments[0].comment);
			});
	});


});
