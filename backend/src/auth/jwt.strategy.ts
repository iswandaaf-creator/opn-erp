import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(JwtStrategy.name);

    constructor() {
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            const logger = new Logger(JwtStrategy.name);
            if (process.env.NODE_ENV === 'production') {
                throw new Error('JWT_SECRET environment variable is required in production!');
            }
            logger.warn('⚠️ JWT_SECRET not set - using default for development only!');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret || 'dev-secret-change-in-production',
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
}
