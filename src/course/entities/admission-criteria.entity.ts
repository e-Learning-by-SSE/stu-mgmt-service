import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AdmissionCriteriaDto } from "../dto/course-config/admission-criteria.dto";
import { CourseConfig } from "./course-config.entity";

@Entity()
export class AdmissionCriteria {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => CourseConfig, courseConfig => courseConfig.admissionCriteria, {
		onDelete: "CASCADE"
	})
	@JoinColumn()
	courseConfig: CourseConfig;

	@Column()
	courseConfigId: number;

	@Column("json")
	admissionCriteria: AdmissionCriteriaDto;

	toDto(): AdmissionCriteriaDto {
		return this.admissionCriteria;
	}
}
