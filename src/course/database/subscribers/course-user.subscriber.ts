import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent } from "typeorm";
import { CourseUserRelation } from "../../../shared/entities/course-user-relation.entity";
import { UpdateService, AffectedObject, EventType, UpdateMessage } from "./update.service";
import { Inject } from "@nestjs/common";

@EventSubscriber()
export class CourseUserRelationSubscriber implements EntitySubscriberInterface<CourseUserRelation> {

	constructor(@Inject() private updateService: UpdateService) { }

	listenTo() {
		// Indicates that this subscriber only listens to CourseUserRelation events
		return CourseUserRelation;
	}

	afterInsert(event: InsertEvent<CourseUserRelation>) {
		this.updateService.send(
			this.createMessage(EventType.INSERT, event.entity)
		);
	}

	afterUpdate(event: UpdateEvent<CourseUserRelation>) {
		this.updateService.send(
			this.createMessage(EventType.UPDATE, event.entity)
		);
	}

	afterRemove(event: RemoveEvent<CourseUserRelation>) {
		this.updateService.send(
			this.createMessage(EventType.REMOVE, event.entity)
		);
	}

	private createMessage(type: EventType, entity: CourseUserRelation): UpdateMessage {
		return {
			type: type,
			affectedObject: AffectedObject.COURSE_USER_RELATION,
			courseId: entity.courseId,
			entityId: entity.courseId,
			entityId_relation: entity.userId
		};
	}
}