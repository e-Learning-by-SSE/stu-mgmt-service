import { Injectable } from "@nestjs/common";
import NodeCache = require("node-cache");

@Injectable()
export class CacheService {
	private cache: NodeCache;

	constructor() {
		this.cache = new NodeCache({
			checkperiod: 60 * 60 * 2, // Check for expired keys every 2 hours
			stdTTL: 60 * 60 // TTL: 1 hour,
		});
	}

	/** Retrieves an item from the cache. */
	get<T>(key: string): T | undefined {
		return this.cache.get(key);
	}

	/** Stores an item in the cache. */
	set<T>(key: string, value: T): void {
		this.cache.set(key, value);
	}
}
