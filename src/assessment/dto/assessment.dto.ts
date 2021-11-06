import { ApiProperty, ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { AssignmentDto } from "../../course/dto/assignment/assignment.dto";
import { ParticipantDto } from "../../course/dto/course-participant/participant.dto";
import { GroupDto } from "../../course/dto/group/group.dto";
import { UserDto } from "../../shared/dto/user.dto";
import { UserId } from "../../shared/entities/user.entity";
import { PartialAssessmentDto } from "./partial-assessment.dto";

export class AssessmentDto {
	/** Unique identifier of this assessment. */
	@ApiProperty({ description: "Unique identifier of this assessment." })
	id: string;

	/** Identifier of the assignment that is being evaluated by this assessment. */
	@ApiProperty({
		description: "Identifier of the assignment that is being evaluated by this assessment."
	})
	assignmentId: string;

	assignment?: AssignmentDto;

	@ApiProperty({ description: "Marks the assessment as a draft." })
	isDraft: boolean;

	/** The amount of points that the student or group achieved with their submission. */
	@ApiProperty({
		description:
			"The amount of points that the student or group achieved with their submission."
	})
	achievedPoints?: number;

	/** A comment providing additional feedback. */
	@ApiPropertyOptional({ description: "A comment providing additional feedback." })
	comment?: string;

	/** If a group submission is being evaluated, contains the identifier of the group. */
	@ApiPropertyOptional({
		description:
			"If a group submission is being evaluated, contains the identifier of the group."
	})
	groupId?: string;

	/** The group, whose submission was evaluated by this assessment. */
	group?: GroupDto;

	/** If a single user is being evaluated, contains the identifier of the user. */
	@ApiPropertyOptional({
		description: "If a single user is being evaluated, contains the identifier of the user."
	})
	userId?: string;

	/** If assessment targets a single user, contains the user. */
	participant?: ParticipantDto;

	/** Identifier of the creator of this assessment. */
	@ApiPropertyOptional({ description: "Identifier of the creator of this assessment." })
	creatorId: string;

	/** The creator of this assessment. */
	creator?: UserDto;

	@ApiPropertyOptional({
		description: "Identifier of the last user that updated this assessment."
	})
	lastUpdatedById?: UserId;
	lastUpdatedBy?: UserDto;

	creationDate?: Date;
	updateDate?: Date;

	partialAssessments?: PartialAssessmentDto[];
}

/** Version of AssessmentDto containing only properties that can used for creation. */
export class AssessmentCreateDto extends OmitType(AssessmentDto, [
	"group",
	"participant",
	"assignment",
	"creator",
	"creatorId",
	"id",
	"lastUpdatedBy",
	"lastUpdatedById",
	"creationDate",
	"updateDate"
]) {}
/** Version of AssessmentDto containing only properties that can be updated. */
export class AssessmentUpdateDto {
	achievedPoints?: number;
	isDraft?: boolean;
	comment?: string;
	partialAssessments?: PartialAssessmentDto[];
}
