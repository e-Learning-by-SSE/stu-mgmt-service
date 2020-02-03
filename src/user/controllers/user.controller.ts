import { Controller, Post, Body, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserDto } from '../../shared/dto/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { CourseDto } from 'src/shared/dto/course.dto';
import { AssessmentDto } from "../../shared/dto/assessment.dto";
import { GroupDto } from "../../shared/dto/group.dto";

@ApiTags("users")
@Controller("users")
export class UserController {

    constructor(private userService: UserService) { }

    @Post()
    createUser(@Body() userDto: UserDto): Promise<UserDto> {
        return this.userService.createUser(userDto);
    }

    @Get()
    getAllUsers(): Promise<UserDto[]> {
        return this.userService.getAllUsers();
    }

    @Get(":id")
    getUserById(@Param("id") id: string): Promise<UserDto> {
        return this.userService.getUserById(id);
    }

    @Get(":id/courses")
    getCoursesOfUser(@Param("id", ParseUUIDPipe) id: string): Promise<CourseDto[]> {
        return this.userService.getCoursesOfUser(id);
    }

    @Get(":id/courses/:courseId/groups")
    getGroupOfUserForCourse(
        @Param("id", ParseUUIDPipe) id: string,
        @Param("courseId", ParseUUIDPipe) courseId: string,
    ): Promise<GroupDto> {

        return this.userService.getGroupOfUserForCourse(id, courseId);
    }
}
