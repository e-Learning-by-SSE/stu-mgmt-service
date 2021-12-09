import { Column, Entity, ManyToOne } from "typeorm";
import { DtoFactory } from "../../shared/dto-factory";
import { EventEntity } from "../../shared/entities/event.entity";
import { User, UserId } from "../../shared/entities/user.entity";
import { GroupEventDto } from "../dto/group/group-event.dto";
import { Group, GroupId } from "./group.entity";

@Entity()
export class GroupEvent extends EventEntity {
	@ManyToOne(() => Group, group => group.history, { onDelete: "CASCADE" })
	group: Group;

	@Column()
	groupId: GroupId;

	@ManyToOne(() => User, { eager: true, onDelete: "CASCADE" })
	user: User;

	@Column()
	userId: UserId;

	toDto(): GroupEventDto {
		return {
			event: this.event,
			userId: this.userId,
			user: this.user ? DtoFactory.createUserDto(this.user) : undefined,
			groupId: this.groupId,
			payload: this.payload,
			timestamp: this.timestamp
		};
	}
}

/** Replays the events by iterating from oldest to newest event and executes the given funtion for each event. */
export function replayEvents(
	events: GroupEvent[],
	processEvent: (event: GroupEvent) => void
): void {
	for (let i = events.length - 1; i >= 0; i--) {
		processEvent(events[i]);
	}
}
