import { CourseConfigDto } from "../../../src/course/dto/course-config/course-config.dto";
import { ADMISSION_CRITERIA_MOCK } from "./admission-criteria.mock";
import {
	GROUP_SETTINGS_GROUPS_ALLOWED_MIN2_MAX3_SELF,
	GROUP_SETTINGS_NO_GROUPS
} from "./group-settings.mock";

export const COURSE_CONFIG_JAVA_1920: CourseConfigDto = {
	id: 1,
	groupSettings: GROUP_SETTINGS_GROUPS_ALLOWED_MIN2_MAX3_SELF,
	admissionCriteria: ADMISSION_CRITERIA_MOCK,
	password: "password"
};

export const COURSE_CONFIG_COURSE_JAVA_1819: CourseConfigDto = {
	id: 2,
	groupSettings: GROUP_SETTINGS_NO_GROUPS,
	admissionCriteria: null,
	password: "password"
};

export const COURSE_CONFIG_COURSE_JAVA2020: CourseConfigDto = {
	id: 3,
	groupSettings: GROUP_SETTINGS_GROUPS_ALLOWED_MIN2_MAX3_SELF,
	admissionCriteria: null
};

export const COURSE_CONFIG_COURSE_INFO_2_2020: CourseConfigDto = {
	id: 4,
	groupSettings: GROUP_SETTINGS_NO_GROUPS,
	admissionCriteria: null
};

export const COURSE_CONFIGS_MOCK: CourseConfigDto[] = [
	COURSE_CONFIG_JAVA_1920,
	COURSE_CONFIG_COURSE_JAVA_1819,
	COURSE_CONFIG_COURSE_JAVA2020,
	COURSE_CONFIG_COURSE_INFO_2_2020
];
