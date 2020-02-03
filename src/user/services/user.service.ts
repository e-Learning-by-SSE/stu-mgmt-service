import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../../shared/entities/user.entity';
import { UserDto } from '../../shared/dto/user.dto';
import * as fromDtoFactory from "../../shared/dto-factory";
import { CourseDto } from 'src/shared/dto/course.dto';
import { GroupDto } from "../../shared/dto/group.dto";
import { Group } from "../../shared/entities/group.entity";
import { GroupRepository } from "../../course/repositories/group.repository";

@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private userRepository: UserRepository,
                @InjectRepository(Group) private groupRepository: GroupRepository) { }

    async createUser(userDto: UserDto): Promise<UserDto> {
        const createdUser = await this.userRepository.createUser(userDto);
        const createdUserDto = fromDtoFactory.createUserDto(createdUser);
        return createdUserDto;
    }

    async getAllUsers(): Promise<UserDto[]> {
        const userDtos: UserDto[] = [];
        const users = await this.userRepository.getAllUsers();
        users.forEach(user => userDtos.push(fromDtoFactory.createUserDto(user)));
        return userDtos;
    }

    async getUserById(id: string): Promise<UserDto> {
        const user = await this.userRepository.getUserById(id);
        const userDto = fromDtoFactory.createUserDto(user);
        return userDto;
    }

    async getCoursesOfUser(userId: string): Promise<CourseDto[]> {
        const courses = await this.userRepository.getCoursesOfUser(userId);
        const courseDtos: CourseDto[] = [];
        courses.forEach(course => courseDtos.push(fromDtoFactory.createCourseDto(course)));
        return courseDtos;
    }

    async getGroupOfUserForCourse(userId: string, courseId: string): Promise<GroupDto> {
        const group = await this.groupRepository.getGroupOfUserForCourse(courseId, userId);
        return fromDtoFactory.createGroupDto(group);
    }
    
}
