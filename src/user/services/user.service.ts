import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CourseDto } from "src/course/dto/course/course.dto";
import { EntityNotFoundError } from "typeorm/error/EntityNotFoundError";
import { AssessmentDto } from "../../assessment/dto/assessment.dto";
import { AssessmentRepository } from "../../assessment/repositories/assessment.repository";
import { GroupEventDto } from "../../course/dto/group/group-event.dto";
import { GroupDto } from "../../course/dto/group/group.dto";
import { AssignmentId } from "../../course/entities/assignment.entity";
import { CourseId } from "../../course/entities/course.entity";
import { Participant } from "../../course/models/participant.model";
import { AssignmentRegistrationRepository } from "../../course/repositories/assignment-registration.repository";
import { AssignmentRepository } from "../../course/repositories/assignment.repository";
import { CourseRepository } from "../../course/repositories/course.repository";
import { GroupEventRepository } from "../../course/repositories/group-event.repository";
import { GroupRepository } from "../../course/repositories/group.repository";
import { ParticipantRepository } from "../../course/repositories/participant.repository";
import { DtoFactory } from "../../shared/dto-factory";
import { ImportResponseDto } from "../dto/import-response.dto";
import { UserDto, UserUpdateDto, UserCreationDto } from "../../shared/dto/user.dto";
import { UserId } from "../../shared/entities/user.entity";
import { AssignmentState, CourseRole, UserRole } from "../../shared/enums";
import { AssignmentGroupTuple } from "../dto/assignment-group-tuple.dto";
import { UserFilter } from "../dto/user.filter";
import { UserRepository } from "../repositories/user.repository";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserRepository) private userRepository: UserRepository,
		@InjectRepository(GroupRepository) private groupRepository: GroupRepository,
		@InjectRepository(AssignmentRepository) private assignmentRepository: AssignmentRepository,
		@InjectRepository(AssessmentRepository) private assessmentRepository: AssessmentRepository,
		@InjectRepository(GroupEventRepository) private groupEventRepository: GroupEventRepository,
		@InjectRepository(CourseRepository) private courseRepo: CourseRepository,
		@InjectRepository(ParticipantRepository) private participantRepo: ParticipantRepository,
		@InjectRepository(AssignmentRegistrationRepository)
		private registrations: AssignmentRegistrationRepository
	) {}

	async createUser(userDto: UserDto): Promise<UserDto> {
		const createdUser = await this.userRepository.createUser(userDto);
		const createdUserDto = DtoFactory.createUserDto(createdUser);
		return createdUserDto;
	}

	async getUsers(filter?: UserFilter): Promise<[UserDto[], number]> {
		const [users, count] = await this.userRepository.getUsers(filter);
		return [users.map(user => DtoFactory.createUserDto(user)), count];
	}

	async getUserById(id: string): Promise<UserDto> {
		const user = await this.userRepository.getUserById(id);
		return DtoFactory.createUserDto(user);
	}

	async getUserByEmail(email: string): Promise<UserDto> {
		const user = await this.userRepository.getUserByEmail(email);
		return DtoFactory.createUserDto(user);
	}

	async getCoursesOfUser(userId: UserId): Promise<CourseDto[]> {
		const courses = await this.userRepository.getCoursesOfUser(userId);
		return courses.map(c => DtoFactory.createCourseDto(c));
	}

	/**
	 * Returns the current group of a user in a course.
	 */
	async getGroupOfUserForCourse(userId: UserId, courseId: CourseId): Promise<GroupDto> {
		const group = await this.groupRepository.getGroupOfUserForCourse(courseId, userId);
		return DtoFactory.createGroupDto(group);
	}

	/**
	 * Returns all group events of the user in the course.
	 * Events are sorted by their timestamp in descending order (new to old).
	 */
	async getGroupHistoryOfUser(userId: UserId, courseId: CourseId): Promise<GroupEventDto[]> {
		const history = await this.groupEventRepository.getGroupHistoryOfUser(userId, courseId);
		return history.map(event => event.toDto());
	}

	/**
	 * Returns the group that the user was a registered member of.
	 */
	async getGroupOfAssignment(
		userId: UserId,
		courseId: CourseId,
		assignmentId: string
	): Promise<GroupDto> {
		return this.registrations.getRegisteredGroupOfUser(assignmentId, userId);
	}

	/**
	 * Returns tuples mapping assignments to the user's registered groups.
	 */
	async getGroupOfAllAssignments(
		userId: UserId,
		courseId: CourseId
	): Promise<AssignmentGroupTuple[]> {
		return this.registrations.getAllRegisteredGroupsOfUserInCourse(courseId, userId);
	}

	/**
	 * Return the user's assessment for the specified assignment.
	 * If `participant` is `STUDENT`, the assignment must be in `EVALUATED` state.
	 * @throws `EntityNotFoundError` if assessment does not exists, or it exists but requested by `STUDENT`
	 * and not `EVALUATED`.
	 */
	async getAssessment(
		participant: Participant,
		assignmentId: AssignmentId
	): Promise<AssessmentDto> {
		if (participant.isStudent()) {
			// Only return assessment, if the assignment is in EVALUATED state
			const assignment = await this.assignmentRepository.getAssignmentById(assignmentId);
			if (assignment.state !== AssignmentState.EVALUATED) {
				throw new EntityNotFoundError(AssessmentDto, {
					assignmentId,
					userId: participant.userId
				});
			}
		}

		const [assessments] = await this.assessmentRepository.getAssessmentsForAssignment(
			assignmentId,
			{
				userId: participant.userId
			}
		);

		if (assessments.length == 0) {
			throw new EntityNotFoundError(AssessmentDto, {
				assignmentId,
				userId: participant.userId
			});
		}

		return DtoFactory.createAssessmentDto(assessments[0]);
	}

	async getAssessmentsOfUserForCourse(
		userId: UserId,
		courseId: CourseId
	): Promise<AssessmentDto[]> {
		const assessments = await this.assessmentRepository.getAssessmentsOfUserForCourse(
			courseId,
			userId
		);
		const evaluated = assessments.filter(a => a.assignment.state === AssignmentState.EVALUATED);
		return evaluated.map(a => DtoFactory.createAssessmentDto(a));
	}

	async updateUser(userId: UserId, userDto: UserUpdateDto): Promise<UserDto> {
		const user = await this.userRepository.updateUser(userId, userDto);
		return DtoFactory.createUserDto(user);
	}

	async setMatrNr(userId: UserId, matrNr: number | undefined | null): Promise<UserDto> {
		await this.userRepository.update(userId, { matrNr: matrNr ?? null });
		return this.getUserById(userId);
	}

	async deleteUser(userId: UserId): Promise<boolean> {
		return this.userRepository.deleteUser(userId);
	}

	/**
	 * Imports multiple students into the system. Must only be called by an administrator.
	 * Existing users may be updated (matrNr, course memberships).
	 * @param users The list of users to be imported/updated.
	 * @returns An object containing the lists of successfully and unsuccessfully imported users.
	 */
	async importUsers(users: UserCreationDto[]): Promise<ImportResponseDto> {
		const successfulImports: string[] = [];
		const failedImports: string[] = [];

		for (const user of users) {
			try {
				let existingUser = await this.userRepository.tryGetUserByUsername(user.username);

				if (existingUser) {
					// Update existing users
					if (user.matrNr !== undefined && existingUser.matrNr == undefined) {
						await this.userRepository.update(existingUser.id, { matrNr: user.matrNr });
					}
				} else {
					// Create new users
					existingUser = await this.userRepository.createUser({
						id: undefined,
						username: user.username,
						email: user.email,
						matrNr: user.matrNr,
						displayName: user.displayName ?? user.username,
						role: UserRole.USER
					});
				}

				// Subscribe existing/new user to specified courses, if he isn't already member and course is not closed
				if (user.courseIds && user.courseIds.length > 0) {
					for (const courseId of user.courseIds) {
						const course = await this.courseRepo.getCourseWithConfigAndGroupSettings(
							courseId
						);

						const isAlreadyInCourse = await this.participantRepo.findOne({
							where: {
								courseId,
								userId: existingUser.id
							}
						});

						if (!course.isClosed && !isAlreadyInCourse) {
							await this.participantRepo.createParticipant(
								courseId,
								existingUser.id,
								CourseRole.STUDENT
							);
						}
					}
				}

				successfulImports.push(user.username);
			} catch (error) {
				failedImports.push(user.username);
			}
		}

		return { successfulImports: successfulImports, failedImports: failedImports };
	}
}
