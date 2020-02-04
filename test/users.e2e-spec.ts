import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getConnection } from 'typeorm';
import { CourseDto } from "../src/shared/dto/course.dto";
import { GroupDto } from "../src/shared/dto/group.dto";
import { AssignmentDto } from "../src/shared/dto/assignment.dto";
import { AssessmentDto } from "../src/shared/dto/assessment.dto";
import { DbMockService } from "./mocks/db-mock.service";
import { UserDto } from "../src/shared/dto/user.dto";

let users: UserDto[];
let courses: CourseDto[];
let groups: GroupDto[];
let assignments: AssignmentDto[];
let assessments: AssessmentDto[];

describe('GET-REQUESTS of UserController (e2e)', () => {
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
		users = dbMockService.users;
		groups = dbMockService.groups;
		assignments = dbMockService.assignments;
		assessments = dbMockService.assessments;
		await dbMockService.createAll();
	});

	afterAll(async () => {
		await getConnection().dropDatabase(); // Drop database with all tables and data
		await getConnection().close(); // Close Db-Connection after all tests have been executed
	});

	it("(GET) /users Retrieves all users", () => {
		return request(app.getHttpServer())
			.get("/users")
			.expect(({ body }) => {
				expect(body.length).toEqual(users.length);
			});
	});

});

describe('POST-REQUESTS of UserController (e2e)', () => {
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
		users = dbMockService.users;
		groups = dbMockService.groups;
		assignments = dbMockService.assignments;
		assessments = dbMockService.assessments;
	});

	afterAll(async () => {
		await getConnection().dropDatabase(); // Drop database with all tables and data
		await getConnection().close(); // Close Db-Connection after all tests have been executed
	});

	it("(POST) /users Creates the given user and returns it (Part 1/2)", () => {
		return request(app.getHttpServer())
			.post("/users")
			.send(users[0])
			.expect(201)
			.expect(({ body }) => {
				expect(body.email).toEqual(users[0].email);
			})
	});
	
});
