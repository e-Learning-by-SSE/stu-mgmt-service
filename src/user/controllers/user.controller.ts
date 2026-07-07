import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Put,
	Query,
	Req,
	UseGuards
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags, PickType } from "@nestjs/swagger";
import { Request } from "express";
import { CourseDto } from "src/course/dto/course/course.dto";
import { AssessmentDto } from "../../assessment/dto/assessment.dto";
import { GetUser } from "../../auth/decorators/get-user.decorator";
import { Roles } from "../../auth/decorators/roles.decorator";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { RoleGuard } from "../../auth/guards/role.guard";
import { GetParticipant } from "../../course/decorators/decorators";
import { GroupEventDto } from "../../course/dto/group/group-event.dto";
import { GroupDto } from "../../course/dto/group/group.dto";
import { CourseId } from "../../course/entities/course.entity";
import { AssignmentGuard } from "../../course/guards/assignment.guard";
import { CourseMemberGuard } from "../../course/guards/course-member/course-member.guard";
import { ParticipantIdentityGuard } from "../../course/guards/identity.guard";
import { Participant } from "../../course/models/participant.model";
import { UserDto, UserUpdateDto } from "../../shared/dto/user.dto";
import { UserId } from "../../shared/entities/user.entity";
import { UserRole } from "../../shared/enums";
import { PaginatedResult, throwIfRequestFailed } from "../../utils/http-utils";
import { AssignmentGroupTuple } from "../dto/assignment-group-tuple.dto";
import { ImportResponseDto } from "../dto/import-response.dto";
import { UserFilter } from "../dto/user.filter";
import { IdentityGuard } from "../guards/identity.guard";
import { UserService } from "../services/user.service";

@ApiBearerAuth()
@ApiTags("user")
@Controller("users")
@UseGuards(AuthGuard, RoleGuard)
export class UserController {
	constructor(private userService: UserService) {}

	@ApiOperation({
		operationId: "createUser",
		summary: "Create user.",
		description: "Creates a user."
	})
	@Post()
	@Roles(UserRole.SYSTEM_ADMIN, UserRole.MGMT_ADMIN)
	createUser(@Body() userDto: UserDto): Promise<UserDto> {
		return this.userService.createUser(userDto);
	}

	@ApiOperation({
		operationId: "getUsers",
		summary: "Get users.",
		description: "Retrieves all users that match the specified filter."
	})
	@Get()
	@Roles(UserRole.SYSTEM_ADMIN, UserRole.MGMT_ADMIN)
	getUsers(@Req() request: Request, @Query() filter?: UserFilter): Promise<UserDto[]> {
		return PaginatedResult(this.userService.getUsers(new UserFilter(filter)), request);
	}

	@ApiOperation({
		operationId: "getUserById",
		summary: "Get user.",
		description: "Retrieves the user."
	})
	@Get(":userId")
	@UseGuards(IdentityGuard)
	getUserById(@Param("userId") userId: UserId): Promise<UserDto> {
		return this.userService.getUserById(userId);
	}

	@ApiOperation({
		operationId: "getUserbyEmail",
		summary: "Get user by email.",
		description: "Retrieves a user by email."
	})
	@Get("email/:email")
	@UseGuards(IdentityGuard)
	getUserbyEmail(@Param("email") email: string): Promise<UserDto> {
		return this.userService.getUserByEmail(email);
	}

	@ApiOperation({
		operationId: "getCoursesOfUser",
		summary: "Get courses of user.",
		description: "Retrieves all courses that the user is a member of."
	})
	@Get(":userId/courses")
	@UseGuards(IdentityGuard)
	getCoursesOfUser(@Param("userId") userId: UserId): Promise<CourseDto[]> {
		return this.userService.getCoursesOfUser(userId);
	}

	@ApiOperation({
		operationId: "getGroupOfUserForCourse",
		summary: "Get group of user for course.",
		description: "Retrieves the user's current group in a course."
	})
	@Get(":userId/courses/:courseId/groups")
	@UseGuards(CourseMemberGuard, ParticipantIdentityGuard)
	getGroupOfUserForCourse(
		@Param("userId") userId: UserId,
		@Param("courseId") courseId: CourseId
	): Promise<GroupDto> {
		return this.userService.getGroupOfUserForCourse(userId, courseId);
	}

	@ApiOperation({
		operationId: "getGroupHistoryOfUser",
		summary: "Get group history of user for course.",
		description:
			"Retrieves the group history of a user in a course. Events are sorted by timestamp in descending order (new to old)."
	})
	@Get(":userId/courses/:courseId/group-history")
	@UseGuards(CourseMemberGuard, ParticipantIdentityGuard)
	getGroupHistoryOfUser(
		@Param("userId") userId: UserId,
		@Param("courseId") courseId: CourseId
	): Promise<GroupEventDto[]> {
		return this.userService.getGroupHistoryOfUser(userId, courseId);
	}

	@ApiOperation({
		operationId: "getGroupOfAssignment",
		summary: "Get group of assignment.",
		description: "Retrieves the registered group of this user for a particular assignment."
	})
	@Get(":userId/courses/:courseId/assignments/:assignmentId/group")
	@UseGuards(CourseMemberGuard, ParticipantIdentityGuard)
	getGroupOfAssignment(
		@Param("userId") userId: UserId,
		@Param("courseId") courseId: CourseId,
		@Param("assignmentId") assignmentId: string
	): Promise<GroupDto> {
		return this.userService.getGroupOfAssignment(userId, courseId, assignmentId);
	}

	@ApiOperation({
		operationId: "getAssessmentOfUser",
		summary: "Get assessment of user.",
		description:
			"Retrieves the assessment of a user for a specific assignment. If requested by PARTICIPANT, assessment must be EVALUATED."
	})
	@Get(":userId/courses/:courseId/assignments/:assignmentId/assessment")
	@UseGuards(CourseMemberGuard, ParticipantIdentityGuard, AssignmentGuard)
	getAssessmentOfUser(
		@Param("userId") userId: UserId,
		@Param("courseId") courseId: CourseId,
		@Param("assignmentId") assignmentId: string,
		@GetParticipant() participant: Participant
	): Promise<AssessmentDto> {
		return this.userService.getAssessment(participant, assignmentId);
	}

	@ApiOperation({
		operationId: "getGroupOfAllAssignments",
		summary: "Get group of all assignments.",
		description:
			"Maps all assignments of a course to the user's group for the corresponding assignment."
	})
	@Get(":userId/courses/:courseId/assignments/groups")
	@UseGuards(CourseMemberGuard, ParticipantIdentityGuard)
	getGroupOfAllAssignments(
		@Param("userId") userId: UserId,
		@Param("courseId") courseId: CourseId
	): Promise<AssignmentGroupTuple[]> {
		return this.userService.getGroupOfAllAssignments(userId, courseId);
	}

	@ApiOperation({
		operationId: "getAssessmentsOfUserForCourse",
		summary: "Get assessments.",
		description:
			"Returns all assessments of the user in the given course. Includes the group, if assessment specified a group."
	})
	@Get(":userId/courses/:courseId/assessments")
	@UseGuards(CourseMemberGuard, ParticipantIdentityGuard)
	getAssessmentsOfUserForCourse(
		@Param("userId") userId: UserId,
		@Param("courseId") courseId: CourseId
	): Promise<AssessmentDto[]> {
		return this.userService.getAssessmentsOfUserForCourse(userId, courseId);
	}

	@ApiOperation({
		operationId: "updateUser",
		summary: "Update user.",
		description: "Updates the user"
	})
	@Patch(":userId")
	@Roles(UserRole.SYSTEM_ADMIN, UserRole.MGMT_ADMIN)
	updateUser(@Param("userId") userId: UserId, @Body() userDto: UserUpdateDto): Promise<UserDto> {
		return this.userService.updateUser(userId, userDto);
	}

	@ApiOperation({
		operationId: "setMatrNr",
		summary: "Set MatrNr",
		description: "Sets the MatrNr of a user."
	})
	@Put(":userId/matrNr")
	@UseGuards(IdentityGuard)
	@ApiBody({
		required: true,
		type: PickType(UserDto, ["matrNr"])
	})
	setMatrNr(
		@Param("userId") userId: string,
		@Body("matrNr") matrNr: number,
		@GetUser() user: UserDto
	): Promise<UserDto> {
		return this.userService.setMatrNr(user.id, matrNr);
	}

	@ApiOperation({
		operationId: "deleteUser",
		summary: "Delete user.",
		description: "Deletes the user. Returns true, if removes was successful."
	})
	@Delete(":userId")
	@Roles(UserRole.SYSTEM_ADMIN, UserRole.MGMT_ADMIN)
	deleteUser(@Param("userId") userId: UserId): Promise<void> {
		return throwIfRequestFailed(
			this.userService.deleteUser(userId),
			`Failed to delete user (${userId})`
		);
	}

	@ApiOperation({
		operationId: "import",
		summary: "Bulk import of multiple users.",
		description:
			"Imports multiple users in bulk. Ingores existing users. Returns true if the import was successful."
	})
	@Post("import")
	@Roles(UserRole.SYSTEM_ADMIN, UserRole.MGMT_ADMIN)
	importUsers(@Body() users: UserDto[]): Promise<ImportResponseDto> {
		return this.userService.importUsers(users);
	}
}
