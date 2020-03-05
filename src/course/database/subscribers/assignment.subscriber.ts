import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent } from "typeorm";
import { Assignment } from "../../../shared/entities/assignment.entity";
import { UpdateService, EventType, AffectedObject } from "./update.service";
import { Inject } from "@nestjs/common";

@EventSubscriber()
export class AssignmentSubscriber implements EntitySubscriberInterface<Assignment> {

	constructor(@Inject() private updateService: UpdateService) { }

	listenTo() {
		// Indicates that this subscriber only listens to Assignment events
		return Assignment;
	}

	afterInsert(event: InsertEvent<Assignment>) {
		this.updateService.send(
			this.createMessage(EventType.INSERT, event.entity)
		);
	}

	afterUpdate(event: UpdateEvent<Assignment>) {
		this.updateService.send(
			this.createMessage(EventType.UPDATE, event.entity)
		);
	}

	afterRemove(event: RemoveEvent<Assignment>) {
		this.updateService.send(
			this.createMessage(EventType.REMOVE, event.entity)
		);
	}

	private createMessage(type: EventType, entity: Assignment) {
		return {
			type: type,
			affectedObject: AffectedObject.ASSIGNMENT,
			courseId: entity.courseId,
			entityId: entity.id
		};
	}
}