import { Repository, EntityRepository, DeleteResult } from "typeorm";
import { Course } from "../../shared/entities/course.entity";
import { CourseDto } from "../../shared/dto/course.dto";

@EntityRepository(Course)
export class CourseRepository extends Repository<Course> {

    async createCourse(courseDto: CourseDto): Promise<Course> {
        const course = this.createEntityFromDto(courseDto);
        const createdCourse = await course.save();
        return createdCourse;
    }

    async getAllCourses(): Promise<Course[]> {
        return await this.find();
    }

    async getCourseById(id: string): Promise<Course> {
        return await this.findOne(id);
    }

    async getCourseByNameAndSemester(name: string, semester: string): Promise<Course> {
        return await this.findOne({
            where: {
                shortname: name,
                semester: semester
            }});
    }

    async getCourseWithUsers(id: string): Promise<Course> {
        return await this.findOne(id, { relations: ["courseUserRelations", "courseUserRelations.user"] });
    }

    async getCourseWithGroups(courseId: string): Promise<Course> {
        return await this.findOne(courseId, {
            relations: ["groups"]
        });
    }

    async updateCourse(courseId: string, courseDto: CourseDto): Promise<Course> {
        const course = this.createEntityFromDto(courseDto);
        return course.save();
    }

    async deleteCourse(courseId: string): Promise<boolean> {
        const deleteResult = await this.delete({
            id: courseId
        });
        return deleteResult.affected == 1;
    }

    private createEntityFromDto(courseDto: CourseDto): Course {
        const course = new Course();
        course.id = courseDto.id ?? courseDto.shortname + "-" + courseDto.semester; // If no id was supplied, <shortname-semester> will be the id
        course.shortname = courseDto.shortname;
        course.semester = courseDto.semester;
        course.title = courseDto.title;
        course.isClosed = courseDto.isClosed;
        course.password = courseDto.password;
        course.link = courseDto.link;
        return course;
    }

}
