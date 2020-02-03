import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getConnection } from 'typeorm';
import { UsersMock } from "./mocks/dto-mocks";

const users = UsersMock;

describe('UserController (e2e)', () => {
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

	it("(POST) /users Creates the given user and returns it (Part 1/2)", () => {
		return request(app.getHttpServer())
			.post("/users")
			.send(users[0])
			.expect(201)
			.expect(({ body }) => {
				expect(body.email).toEqual(users[0].email);
			})
	});
	
	it("(POST) /users Creates the given user returns it (Part 2/2)", () => {
		return request(app.getHttpServer())
		.post("/users")
		.send(users[1])
		.expect(201)
		.expect(({ body }) => {
			expect(body.email).toEqual(users[1].email);
		})
	});

	it("(GET) /users Retrieves all users", () => {
		return request(app.getHttpServer())
			.get("/users")
			.expect(({ body }) => {
				expect(body.length).toEqual(users.length);
			});
	});

});
