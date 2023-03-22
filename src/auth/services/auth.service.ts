import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DtoFactory } from "../../shared/dto-factory";
import { UserDto } from "../../shared/dto/user.dto";
import { User } from "../../shared/entities/user.entity";
import { UserRole } from "../../shared/enums";
import { UserRepository } from "../../user/repositories/user.repository";

type AuthInfo = {
	username: string;
	preferredUsername: string;
	email: string;
	role: UserRole;
};

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(@InjectRepository(UserRepository) private userRepository: UserRepository) {}

	async getUserById(id: string): Promise<UserDto> {
		const user = await this.userRepository.getUserById(id);
		return DtoFactory.createUserDto(user);
	}

	/**
	 * Tries to look up the external user by their `username`.
	 * If it does not exists, the user will be created.
	 *
	 * @param extUser - AuthInfo returned from SparkyService.
	 */
	async getOrCreateUser(extUser: AuthInfo): Promise<UserDto> {
		// Try to find user in this system
		let intUser = await this.userRepository.tryGetUserByUsername(extUser.username);

		if (!intUser) {
			// User does not exist, create account in this system
			intUser = await this.createUser(extUser);
			this.logger.verbose("Created new user: " + intUser.username);
		} else if (this.userInfoHasChanged(intUser, extUser)) {
			intUser = await this.updateUser(intUser, extUser);
		}

		return DtoFactory.createUserDto(intUser);
	}

	/**
	 * Updates the user's `email` and `displayName` according to the information received
	 * from Sparkyservice.
	 */
	async updateUser(user: User, authInfo: AuthInfo): Promise<User> {
		return this.userRepository.updateUser(user.id, {
			...user,
			email: authInfo.email,
			displayName: authInfo.preferredUsername ?? user.username
		});
	}

	/**
	 * Returns `true`, if the user's `email` or `displayName` have been changed by Sparkyservice.
	 */
	userInfoHasChanged(user: User, authInfo: AuthInfo): boolean {
		return user.email !== authInfo.email || user.displayName !== authInfo.preferredUsername;
	}

	async createUser(authInfo: AuthInfo): Promise<User> {
		const username = authInfo.username;
		const displayName =
			authInfo.preferredUsername?.length > 0 ? authInfo.preferredUsername : authInfo.username;
		const email = authInfo.email;
		const role = authInfo.role;

		return this.userRepository.createUser({
			id: undefined,
			username,
			displayName,
			email,
			role
		});
	}
}
