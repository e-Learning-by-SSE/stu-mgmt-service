import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * Retrieves the `course` property of the `request`.
 * This property is set by the following guards:
 * - `CourseMemberGuard`
 */
export const GetCourse = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	return request.course;
});

/**
 * Retrieves the `participant` property of the `request`.  
 * It contains the participant that issued the request.
 * This property is set by the following guards:
 * - `CourseMemberGuard`
 */
export const GetParticipant = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	return request.participant;
});

/**
 * Retrieves the `selectedParticipant` property of the `request`.  
 * It contains the participant that is targeted by the request, 
 * i.e. the participant that should be removed from the course.  
 * This property is set by the following guards:
 * - `SelectedParticipantGuard`
 */
export const GetSelectedParticipant = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	return request.participant;
});

/**
 * Retrieves the `group` property of the `request`.
 * This property is set by the following guards:  
 * - `GroupGuard`
 */
export const GetGroup = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	return request.group;
});