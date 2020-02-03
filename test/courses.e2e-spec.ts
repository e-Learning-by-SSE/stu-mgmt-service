import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getConnection } from 'typeorm';
import { CoursesMock, GroupsMock, AssignmentsMock, AssessmentsMock } from "./mocks/dto-mocks";

// Setup mocks
const courses = CoursesMock;
const groups = GroupsMock;
const assignments = AssignmentsMock;
const assessments = AssessmentsMock;

describe('CourseController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
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

	it("(GET) /courses Retrieves all courses", () => {
		return request(app.getHttpServer())
			.get("/courses")
			.expect(({ body }) => {
				expect(body.length).toEqual(courses.length); 
			});
	});

	it("(GET) /courses/{courseId} Retrieves the courses", () => {
		return request(app.getHttpServer())
			.get("/courses"+ courses[0].id)
			.expect(({ body }) => {
				expect(body.id).toEqual(courses[0].id); 
			});
	});

	it("(POST) /courses/groups Creates the given group and returns it (Part 1/2)", () => {
		return request(app.getHttpServer())
			.post("/courses/groups")
			.send(groups[0]) // CourseId does not need to be specified here, because Course was created with given Id
			.expect(201)
			.expect(({ body }) => {
				expect(body.courseId).toEqual(groups[0].courseId);
				expect(body.name).toEqual(groups[0].name);
			})
	});

	it("(POST) /courses/groups Creates the given group and returns it (Part 2/2)", () => {
		return request(app.getHttpServer())
			.post("/courses/groups")
			.send(groups[1]) // CourseId does not need to be specified here, because Course was created with given Id
			.expect(201)
			.expect(({ body }) => {
				expect(body.courseId).toEqual(groups[1].courseId);
				expect(body.name).toEqual(groups[1].name);
			})
	});

	it("(GET) /courses/groups Retrieves all groups of a course", () => {
		return request(app.getHttpServer())
			.get("/courses/groups")
			.expect(({ body }) => {
				expect(body.length).toEqual(groups.length); 
			});
	});

	assignments.forEach((assignment, index) => {
		it("(POST) /courses/assignments Creates the given assignment and returns it #" + index, () => {
			return request(app.getHttpServer())
				.post("/courses/assignments")
				.send(assignment) // CourseId does not need to be specified here, because Course was created with given Id
				.expect(201)
				.expect(({ body }) => {
					expect(body.courseId).toEqual(assignment.courseId);
					expect(body.name).toEqual(assignment.name);
					expect(body.type).toEqual(assignment.type);
					expect(body.maxPoints).toEqual(assignment.maxPoints);

					// Save id of created assignment for further testing
					assignments[index].id = body.id;
				});
		});
	});

	it("(GET) /courses/assignments Retrieves all assignments of a course", () => {
		return request(app.getHttpServer())
			.get("/courses/assignments")
			.expect(({ body }) => {
				expect(body.length).toEqual(assignments.length); 
			});
	});

	it("(GET) /courses/assignments/{assignmentId} Retrieves the assignments", () => {
		return request(app.getHttpServer())
			.get("/courses/assignments" + assignments[0].id)
			.expect(({ body }) => {
				expect(body.id).toEqual(assignments[0].id); 
			});
	});

	it("POST /courses/assignment/{assignmentId}/assessments Creates the given assessment and returns it #", () => {
		// Setup AssessmentDto
		assessments[0].assignmentId = assignments[0].id; // Assign id of the created assignment
		assessments[0].groupId = groups[0].id; // Assign id of the created group

		return request(app.getHttpServer())
			.post("/courses/assignments" + assignments[0] + "/assessments")
			.send(assessments[0]) 
			.expect(201)
			.expect(({ body }) => {
				expect(body.assignmentId).toEqual(assessments[0].assignmentId);
				expect(body.achievedPoints).toEqual(assessments[0].achievedPoints);
				expect(body.comment).toEqual(assessments[0].comment);
				expect(body.groupId).toEqual(assessments[0].groupId);

			// Save id of created assignment for further testing
			assessments[0].id = body.id;
		});
	});

	it("GET /courses/assignment/{assignmentId}/assessments/{assessmentId} Retrieves the assessment", () => {
		return request(app.getHttpServer())
		.get("/courses/assignments/" + assignments[0].id + "/assessments/"+ assessments[0].id)
		.expect(({ body }) => {
			expect(body.id).toEqual(assessments[0].id); 
		});
	});

});
