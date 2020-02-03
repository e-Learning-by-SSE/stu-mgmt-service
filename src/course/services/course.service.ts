import { Injectable, BadRequestException } from '@nestjs/common';
import { CourseDto } from 'src/shared/dto/course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseRepository } from '../repositories/course.repository';
import { Course } from '../../shared/entities/course.entity';
import { User } from '../../shared/entities/user.entity';
import { UserRepository } from '../../user/repositories/user.repository';
import { CourseUserRelation } from '../../shared/entities/course-user-relation.entity';
import { CourseUserRelationRepository } from '../repositories/course-user-relation.repository';
import * as fromDtoFactory from "../../shared/dto-factory";
import { UserDto } from "../../shared/dto/user.dto";

@Injectable()
export class CourseService {

    constructor(@InjectRepository(Course) private courseRepository: CourseRepository,
                @InjectRepository(User) private userRepository: UserRepository,
				@InjectRepository(CourseUserRelation) private courseUserRepository: CourseUserRelationRepository) { }

    async createCourse(courseDto: CourseDto): Promise<CourseDto> {
        const createdCourse = await this.courseRepository.createCourse(courseDto);
        return fromDtoFactory.createCourseDto(createdCourse);
	}
	
    async addUser(courseId: string, userId: string): Promise<any> { // TODO: don't return any
        return await this.courseUserRepository.addUserToCourse(courseId, userId, "student"); // TODO: don't hardcode role 
    }

    async getAllCourses(): Promise<CourseDto[]> {
        const courseDtos: CourseDto[] = [];
        const courses = await this.courseRepository.getAllCourses();
        courses.forEach(course => courseDtos.push(fromDtoFactory.createCourseDto(course)));
        return courseDtos;
    }

    async getCourseById(id: string): Promise<CourseDto> {
        const course = await this.courseRepository.getCourseById(id);
        const courseDto = fromDtoFactory.createCourseDto(course);
        return courseDto;
    }

    async getCourseByNameAndSemester(name: string, semester: string): Promise<CourseDto> {
        const course = await this.courseRepository.getCourseByNameAndSemester(name, semester);
        const courseDto = fromDtoFactory.createCourseDto(course);
        return courseDto;
    }

    async getUsersOfCourse(courseId: string): Promise<UserDto[]> {
        const course = await this.courseRepository.getCourseWithUsers(courseId);
        const userDtos: UserDto[] = [];
        course.courseUserRelations.forEach(courseUserRelation => {
            userDtos.push(fromDtoFactory.createUserDto(courseUserRelation.user));
        });
        return userDtos;
    }

    async updateCourse(courseId: string, courseDto: CourseDto): Promise<CourseDto> {
        return await this.courseRepository.updateCourse(courseId, courseDto);
    }

    async deleteCourse(courseId: string): Promise<boolean> {
        return await this.courseRepository.deleteCourse(courseId);
    }

}
