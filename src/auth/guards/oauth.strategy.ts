import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { expressjwt, GetVerificationKey } from "express-jwt";
import { expressJwtSecret } from "jwks-rsa";
import { UserRole } from "src/shared/enums";
import { promisify } from "util";
import { Config } from "../../.config/config";
import { environment } from "../../.config/environment";
import { AuthService } from "../services/auth.service";
import { AuthStrategy } from "./auth.strategy";

@Injectable()
export class OAuthStrategy extends AuthStrategy {
	constructor(private authService: AuthService) {
		super();
	}

	checkJwt = promisify(
		expressjwt({
			secret: expressJwtSecret({
				cache: true,
				rateLimit: true,
				jwksRequestsPerMinute: 5,
				jwksUri: Config.get().authentication.jwksUrl
			}) as GetVerificationKey,
			issuer: Config.get().authentication.issuerUrl,
			// audience: "Student-Mgmt-API",
			algorithms: ["RS256"]
		})
	);

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = context.switchToHttp();
		const request = ctx.getRequest();
		const response = ctx.getResponse();

		try {
			await this.checkJwt(request, response);

			//console.log(request.auth); // Uncomment to inspect decoded token

			const user = await this.authService.getOrCreateUser({
				username: request.auth.sub,
				preferredUsername: request.auth.preferred_username,
				email: request.auth.email,
				role: request.auth.realm_access.roles.includes("stumgmt_admin") ? UserRole.MGMT_ADMIN : UserRole.USER
			});

			request.user = user;
			return true;
		} catch (error) {
			if (!environment.is("production")) {
				console.error(error);
			}

			throw new UnauthorizedException(error);
		}
	}
}
