import { ApiProperty, ApiPropertyOptional, OmitType, PartialType } from "@nestjs/swagger";
import { AssignmentState, AssignmentType, CollaborationType } from "../../../shared/enums";
import { LinkDto } from "../../../shared/dto/link.dto";
import { SubmissionConfigDto } from "src/shared/dto/submission-config.dto";

export class AssignmentDto {
	/** Unique identifier of this assignment. */
	@ApiProperty({ description: "Unique identifier of this assignment." })
	id: string;

	/** The title of this assignment. */
	@ApiProperty({ description: "The title of this assignment." })
	name: string;

	/** Determines, wether students can submit, assessments should be published, etc. */
	@ApiProperty({
		description: "Determines, wether students can submit, assessments should be published, etc."
	})
	state: AssignmentState;

	/** Date at which this assignment should enter the IN_PROGRESS-state to allow submissions. */
	@ApiPropertyOptional({
		description:
			"Date at which this assignment should enter the IN_PROGRESS-state to allow submissions."
	})
	startDate?: Date;

	/** Date at which this assignment should enter the IN_REVIEW-state to disable submissions. */
	@ApiPropertyOptional({
		description:
			"Date at which this assignment should enter the IN_REVIEW-state to disable submissions."
	})
	endDate?: Date;

	/** The type of assignment, i.e homework or project. */
	@ApiProperty({
		description: "The type of assignment, i.e homework or project.",
		example: AssignmentType.HOMEWORK
	})
	type: AssignmentType;

	/** Determines, wether students can submit their solutions in groups, alone or both. */
	@ApiProperty({
		description:
			"Determines, wether students can submit their solutions in groups, alone or both."
	})
	collaboration: CollaborationType;

	/** The amount of points that can be reached by a participant (excluding bonus points). */
	@ApiProperty({
		description:
			"The amount of points that can be reached by a participant (excluding bonus points)."
	})
	points: number;

	/** The amount of additional bonus points, which should be excluded from the admission criteria. */
	@ApiPropertyOptional({
		description:
			"The amount of additional bonus points, which should be excluded from the admission criteria."
	})
	bonusPoints?: number;

	/** Additional information or description of this assignment. */
	@ApiPropertyOptional({
		description: "Additional information or description of this assignment."
	})
	comment?: string;

	links?: LinkDto[];

	/** Optional information to allow the configuration of connected submission tools. */
	@ApiPropertyOptional({
		description: "Optional information to allow the configuration of connected submission tools."
	})
	configs?: SubmissionConfigDto[];
}

export class AssignmentUpdateDto extends OmitType(PartialType(AssignmentDto), ["id"]) {}
