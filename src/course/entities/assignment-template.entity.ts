import { BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, Entity, JoinColumn } from "typeorm";
import { AssignmentType, CollaborationType } from "../../shared/enums";
import { CourseConfig } from "./course-config.entity";
import { AssignmentTemplateDto } from "../dto/assignment-template.dto";

@Entity()
export class AssignmentTemplate extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(type => CourseConfig, courseConfig => courseConfig.assignmentTemplates, { onDelete: "CASCADE" })
	@JoinColumn()
	courseConfig: CourseConfig;

	@Column()
	courseConfigId: number;

	@Column()
	templateName: string;

	@Column({ nullable: true })
	name?: string;

	@Column({ type: "enum", enum: AssignmentType, default: AssignmentType.HOMEWORK, nullable: true })
	type?: AssignmentType;

	@Column({ type: "enum", enum: CollaborationType, default: CollaborationType.GROUP_OR_SINGLE, nullable: true })
	collaboration?: CollaborationType;

	@Column({ nullable: true })
	points?: number;

	@Column({ nullable: true })
	bonusPoints?: number;

	toDto(): AssignmentTemplateDto {
		return {
			id: this.id,
			templateName: this.templateName,
			collaboration: this.collaboration,
			type: this.type,
			name: this.name,
			points: this.points,
			bonusPoints: this.bonusPoints,
		};
	}
}