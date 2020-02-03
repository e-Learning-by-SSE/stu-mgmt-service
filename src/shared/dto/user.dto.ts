import { CourseDto } from "./course.dto";

export class UserDto {
    id?: string;
    email: string;
    role: string;
    courses?: CourseDto[];
}