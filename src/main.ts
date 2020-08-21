import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import * as config from "config";
import { DbMockService } from "../test/mocks/db-mock.service";
import { getConnection } from "typeorm";
import { EntityNotFoundFilter } from "./shared/entity-not-found.filter";
import { ValidationPipe } from "@nestjs/common";
import { StudentMgmtException } from "./course/exceptions/custom-exceptions";
import { StudentMgmtEvent } from "./course/events";

async function bootstrap(): Promise<void> {
	const serverConfig = config.get("server");
	const port = process.env.SERVER_PORT || serverConfig.port;
	const app = await NestFactory.create(AppModule);
	app.useGlobalFilters(new EntityNotFoundFilter());
	app.useGlobalPipes(new ValidationPipe({ transform: true })); // Automatically transform primitive params to their type
	app.enableCors({ exposedHeaders: "x-total-count" });
	//app.setGlobalPrefix("mgmt/v1");

	const options = new DocumentBuilder()
		.addBearerAuth()
		.setTitle("Student-Management-System-API")
		.setDescription("The Student-Management-Sytem-API. <a href='http://localhost:3000/api-json'>JSON</a>") // TODO: Replace hard-coded link
		.setVersion("1.0")
		.addTag("authentication")
		.addTag("courses")
		.addTag("course-participants")
		.addTag("course-config")
		.addTag("assignments")
		.addTag("assessments")
		.addTag("groups")
		.addTag("users")
		.addTag("assignment-registration")
		.addTag("assessment-allocation")
		.addTag("csv")
		.addTag("test")
		.build();
	const document = SwaggerModule.createDocument(app, options, { extraModels: [StudentMgmtException, StudentMgmtEvent] });
	SwaggerModule.setup("api", app, document);

	// If demo environment, populate database with test data
	if (process.env.NODE_ENV == "demo") {
		const dbMockService = new DbMockService(getConnection());
		await dbMockService.createAll();
	}

	console.log(`Environment: ${process.env.NODE_ENV}`);
	await app.listen(port);
}
bootstrap();
