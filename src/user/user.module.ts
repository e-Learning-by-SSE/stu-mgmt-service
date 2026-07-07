import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { AssignmentRegistrationRepository } from "../course/repositories/assignment-registration.repository";
import { AssignmentRepository } from "../course/repositories/assignment.repository";
import { GroupEventRepository } from "../course/repositories/group-event.repository";
import { GroupRepository } from "../course/repositories/group.repository";
import { UserController } from "./controllers/user.controller";
import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./services/user.service";
import { IdentityGuard } from "./guards/identity.guard";
import { CourseModule } from "../course/course.module";
import { AssessmentRepository } from "../assessment/repositories/assessment.repository";
import { UserSettingsController } from "./controllers/user-settings.controller";
import { UserSettings } from "./entities/user-settings.entity";
import { UserSettingsService } from "./services/user-settings.service";
import { CourseRepository } from "../course/repositories/course.repository";
import { ParticipantRepository } from "../course/repositories/participant.repository";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			UserRepository,
			UserSettings,
			GroupRepository,
			GroupEventRepository,
			AssignmentRepository,
			AssignmentRegistrationRepository,
			AssessmentRepository,
			CourseRepository,
			ParticipantRepository
		]),
		AuthModule,
		CourseModule
	],
	controllers: [UserController, UserSettingsController],
	providers: [UserService, UserSettingsService, IdentityGuard]
})
export class UserModule {}
