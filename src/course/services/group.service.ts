import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GroupRepository } from "../repositories/group.repository";
import { CourseRepository } from "../repositories/course.repository";
import { Course } from "../../shared/entities/course.entity";
import { Group } from "../../shared/entities/group.entity";
import { GroupDto } from "../../shared/dto/group.dto";
import { UserDto } from "../../shared/dto/user.dto";
import * as fromDtoFactory from "../../shared/dto-factory";

@Injectable()
export class GroupService {

	constructor(@InjectRepository(Group) private groupRepositoy: GroupRepository,
				@InjectRepository(Course) private courseRepository: CourseRepository) { }

	async createGroup(courseId: string, groupDto: GroupDto): Promise<GroupDto> {
		const createdGroup = await this.groupRepositoy.createGroup(courseId, groupDto);
		const createdGroupDto = fromDtoFactory.createGroupDto(createdGroup);
		return createdGroupDto;
	}

	async addUserToGroup(groupId: string, userId: string): Promise<any> {
		return await this.groupRepositoy.addUserToGroup(groupId, userId);
	}

	async getGroupsOfCourse(courseId: string): Promise<GroupDto[]> {
		const groups = await this.groupRepositoy.getGroupsOfCourse(courseId);
		return groups;
	}

	async getUsersOfGroup(groupId: string): Promise<UserDto[]> {
		const group = await this.groupRepositoy.getGroupWithUsers(groupId);
		const userDtos = [];
		group.userGroupRelations.forEach(userGroupRelation => {
			userDtos.push(fromDtoFactory.createUserDto(userGroupRelation.user));
		});
		return userDtos;
	}

}