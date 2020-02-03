import { Repository, EntityRepository, QueryBuilder } from "typeorm";
import { Group } from "../../shared/entities/group.entity";
import { GroupDto } from "../../shared/dto/group.dto";
import { Course } from "../../shared/entities/course.entity";
import { UserGroupRelation } from "../../shared/entities/user-group-relation.entity";

@EntityRepository(Group)
export class GroupRepository extends Repository<Group> {

	async createGroup(courseId: string, groupDto: GroupDto): Promise<Group> {
		const group = new Group();
		group.courseId = courseId;
		group.name = groupDto.name;
		group.password = groupDto.password;
		group.isClosed = groupDto.isClosed;
		await group.save();

		return group;
	}

	async addUserToGroup(groupId: string, userId: string): Promise<any> {
		const userGroupRelation = new UserGroupRelation();
		userGroupRelation.groupId = groupId;
		userGroupRelation.userId = userId;
		return await userGroupRelation.save();
	}

	async getGroupWithUsers(groupId: string) {
		return await this.findOne(groupId, {
			relations: ["userGroupRelations", "userGroupRelations.user"]
		});
	}

	async getGroupsOfCourse(courseId: string) {
		return await this.find({
			where: {
				courseId: courseId
			}
		});
	}

	async getGroupOfUserForCourse(courseId: string, userId: string): Promise<any> {
		const repo = new Repository<UserGroupRelation>();
		throw new Error("NYE");
	}

}