import { ApiProperty, OmitType } from "@nestjs/swagger";
import { CourseDto } from "../../course/dto/course/course.dto";
import { UserRole } from "../enums";

export class UserDto {
	/** Unique identifier of this user. */
	@ApiProperty({ description: "Unique identifier of this user." })
	id: string;
	matrNr?: number;
	email?: string;
	username: string;
	displayName: string;

	/** Role within the application. */
	@ApiProperty({ description: "Role within the application." })
	role: UserRole;

	courses?: CourseDto[];
}

export class UserUpdateDto extends OmitType(UserDto, ["id", "username", "courses"]) {}

export class UserCreationDto extends OmitType(UserDto, ["id", "courses", "displayName", "role"]) {
	displayName?: string;
	role?: UserRole;
	courseIds?: string[];
}
