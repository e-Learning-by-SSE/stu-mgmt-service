import { Controller, Get, Param, Post, Body, ParseUUIDPipe, Patch, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CourseService } from '../services/course.service';
import { CourseDto } from '../../shared/dto/course.dto';
import { GroupDto } from '../../shared/dto/group.dto';
import { GroupService } from '../services/group.service';
import { AssignmentDto } from '../../shared/dto/assignment.dto';
import { AssignmentService } from "../services/assignment.service";
import { AssessmentDto } from "../../shared/dto/assessment.dto";
import { AssessmentService } from "../services/assessment.service";
import { UserDto } from "../../shared/dto/user.dto";

@ApiTags("courses") 
@Controller("courses")
export class CourseController {
	constructor(private courseService: CourseService,
				private groupService: GroupService,
				private assignmentService: AssignmentService,
				private assessmentService: AssessmentService) { }

	@Post()
	createCourse(@Body() courseDto: CourseDto): Promise<CourseDto> {
		return this.courseService.createCourse(courseDto);
	}

	@Post(":id/groups")
	createGroup(
		@Param("id") id: string,
		@Body() groupDto: GroupDto
	): Promise<GroupDto> {

		return this.groupService.createGroup(id, groupDto);
	}

	@Post(":id/users/:userId")
	addUser(@Param("id") id: string,
			@Param("userId", ParseUUIDPipe) userId: string): Promise<any> {
		return this.courseService.addUser(id, userId);
	}
	

	@Post(":id/assignments")
	createAssignment(
		@Param("id") id: string,
		@Body() assignmentDto: AssignmentDto
	): Promise<AssignmentDto> {

		return this.assignmentService.createAssignment(id, assignmentDto);
	}

	@Post(":id/assignments/:assignmentId/assessments")
	createAssessment(
		@Param("assignmentId", ParseUUIDPipe) assignmentId: string,
		@Body() assessmentDto: AssessmentDto
	): Promise<AssessmentDto> {

		// TODO: Check if user is allowed to submit assessments for this course
		return this.assessmentService.createAssessment(assignmentId, assessmentDto);
	}

	@Get()
	getAllCourses(): Promise<CourseDto[]> {
		return this.courseService.getAllCourses();
	}

	@Get(":id")
	getCourseById(@Param("id") id: string): Promise<CourseDto> {
		return this.courseService.getCourseById(id);
	}

	@Get(":id/users")
	getUsersOfCourse(@Param("id") id: string): Promise<UserDto[]> {
		return this.courseService.getUsersOfCourse(id);
	}

	@Get(":id/groups")
	getGroupsOfCourse(
		@Param("id") id: string,
	): Promise<GroupDto[]> {

		return this.groupService.getGroupsOfCourse(id);
	}

	@Get(":id/assignments")
	getAssignmentsOfCourse(
		@Param("id") id: string,
	): Promise<AssignmentDto[]> {

		return this.assignmentService.getAssignments(id);
	}

	@Get(":id/assignments/:assignmentId/assessments")
	getAllAssessmentsForAssignment(
		@Param("id") id: string,
		@Param("assignmentId", ParseUUIDPipe) assignmentId: string
	): Promise<AssessmentDto[]> {

		// TODO: Check if user is allowed to request all assessments
		return this.assessmentService.getAssessmentsForAssignment(assignmentId);
	}

	@Get(":name/:semester")
	getCourseByNameAndSemester(
		@Param("name") name: string,
		@Param("semester") semester: string
	): Promise<CourseDto> {

		return this.courseService.getCourseByNameAndSemester(name, semester);
	}

	@Patch(":id")
	updateCourse(
		@Param("id") id: string,
		@Body() courseDto: CourseDto
	): Promise<CourseDto> {

		return this.courseService.updateCourse(id, courseDto);
	}

	@Delete(":id")
	deleteCourse(
		@Param("id") id: string,
	): Promise<boolean> {

		return this.courseService.deleteCourse(id);
	}

}
