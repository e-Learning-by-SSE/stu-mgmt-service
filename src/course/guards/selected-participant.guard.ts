import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityNotFoundError } from "typeorm/error/EntityNotFoundError";
import { UserId } from "../../shared/entities/user.entity";
import { CourseId } from "../entities/course.entity";
import { NotACourseMemberException } from "../exceptions/custom-exceptions";
import { Participant } from "../models/participant.model";
import { ParticipantRepository } from "../repositories/participant.repository";

/**
 * Attaches the `selectedParticipant` to the `request`, meaning the participant that was specified
 * in the `userId` parameter of the route.
 * @throws `NotACourseMemberException`
 */
@Injectable()
export class SelectedParticipantGuard implements CanActivate {
	constructor(
		@InjectRepository(ParticipantRepository) private participants: ParticipantRepository
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const courseId: CourseId = request.params.courseId;
		const userId: UserId = request.params.userId;

		try {
			const participant = await this.participants.getParticipant(courseId, userId);
			request.selectedParticipant = new Participant(participant);
			return true;
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				throw new NotACourseMemberException(courseId, userId);
			}
		}

		return false;
	}
}
