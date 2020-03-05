import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Course } from '../shared/entities/course.entity';
import { User } from '../shared/entities/user.entity';
import * as config from "config"
import { CourseUserRelation } from '../shared/entities/course-user-relation.entity';
import { Group } from '../shared/entities/group.entity';
import { UserGroupRelation } from '../shared/entities/user-group-relation.entity';
import { Assignment } from '../shared/entities/assignment.entity';
import { Assessment } from "../shared/entities/assessment.entity";
import { AssessmentUserRelation } from "../shared/entities/assessment-user-relation.entity";
import { AssignmentSubscriber } from "../course/database/subscribers/assignment.subscriber";
import { UserGroupRelationSubscriber } from "../course/database/subscribers/user-group.subscriber";
import { CourseUserRelationSubscriber } from "../course/database/subscribers/course-user.subscriber";

const dbConfig = config.get("db");

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: process.env.DB_TYPE || dbConfig.type,
  host: process.env.DB_HOST || dbConfig.host,
  port: process.env.DB_PORT || dbConfig.port,
  username: process.env.DB_USERNAME || dbConfig.username,
  password: process.env.DB_PASSWORD || dbConfig.password,
  database: process.env.DB_DATABASE || dbConfig.database,
  synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
  dropSchema: dbConfig.dropSchema || false,
  keepConnectionAlive: true, // prevents AlreadyHasActiveConnectionError, needed for testing // TODO: Check if it should be disabled in production
  entities: [Course, User, Group, CourseUserRelation, UserGroupRelation, Assignment, Assessment, AssessmentUserRelation],
  subscribers: [CourseUserRelationSubscriber, UserGroupRelationSubscriber, AssignmentSubscriber],
};
