import { Module, HttpModule } from '@nestjs/common';
import { CourseController } from './controllers/course.controller';
import { CourseService } from './services/course.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseRepository } from './database/repositories/course.repository';
import { UserRepository } from '../user/repositories/user.repository';
import { CourseUserRelationRepository } from './database/repositories/course-user-relation.repository';
import { GroupService } from './services/group.service';
import { GroupRepository } from './database/repositories/group.repository';
import { GroupController } from './controllers/group.controller';
import { AssignmentService } from './services/assignment.service';
import { AssignmentRepository } from "./database/repositories/assignment.repository";
import { AssessmentService } from "./services/assessment.service";
import { AssessmentRepository } from "./database/repositories/assessment.repository";
import { AssessmentUserRelationRepository } from "./database/repositories/assessment-user-relation.repository";
import { AssessmentController } from './controllers/assessment.controller';
import { AssignmentController } from './controllers/assignment.controller';
import { UpdateService } from "./database/subscribers/update.service";

@Module({
  imports: [TypeOrmModule.forFeature([
    CourseRepository, 
    UserRepository, 
    CourseUserRelationRepository, 
    GroupRepository, 
    AssignmentRepository, 
    AssessmentRepository,
    AssessmentUserRelationRepository
  ]),
    HttpModule
  ],
  controllers: [AssessmentController, AssignmentController, CourseController, GroupController],
  providers: [CourseService, GroupService, AssignmentService, AssessmentService, { provide: UpdateService, useClass: UpdateService }]
})
export class CourseModule {}
