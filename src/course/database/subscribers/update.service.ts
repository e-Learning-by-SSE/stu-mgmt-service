import { Injectable, HttpService } from "@nestjs/common";

export enum EventType {
	INSERT = "INSERT",
	UPDATE = "UPDATE",
	REMOVE = "REMOVE"
}

export enum AffectedObject {
	USER = "USER",
	GROUP = "GROUP",
	USER_GROUP_RELATION = "USER_GROUP_RELATION",
	COURSE_USER_RELATION = "COURSE_USER_RELATION",
	ASSIGNMENT = "ASSIGNMENT"
}

export class UpdateMessage {
	type: EventType;
	affectedObject: AffectedObject;
	courseId: string;
	entityId: string;
	entityId_relation?: string; 
}

@Injectable()
export class UpdateService { 

	private courseMap = new Map<string, string>(); // TODO: Create data structure to save urls

	constructor(private http: HttpService) {
		// this.courseMap.set("info2-sose2020", "www.INSERT-URL-HERE.test");
		// this.courseMap.set("java-wise1920", "www.INSERT-URL-HERE.test");
	}

	/**
	 * Sends the given message using http (POST), if the affected course has configured a url for update events.
	 */
	send(message: UpdateMessage): void {
		console.log("Send UpdateMessage triggered : )");
		
		// Check, if the course has configured a url for update messages
		const url = this.courseMap.get(message.courseId);
		if (url) {
			// Send message using http (POST)
			this.http.post(this.courseMap.get(message.courseId), message);
		}
	}

}