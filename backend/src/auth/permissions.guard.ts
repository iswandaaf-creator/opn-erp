import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermission = this.reflector.get<string[]>('permissions', context.getHandler());
        if (!requiredPermission) {
            return true; // No permission required
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Logic: Check if user.role.permissions has the required key/value
        // Simplified for now:
        if (!user || !user.role || !user.role.permissions) {
            throw new ForbiddenException('User has no permissions assigned');
        }

        // Example check: requiredPermission = ['pos', 'write']
        // user.permissions = { pos: { write: true } }

        const [module, action] = requiredPermission; // e.g., 'pos', 'create'
        const modulePerms = user.role.permissions[module];

        if (modulePerms && modulePerms[action] === true) {
            return true;
        }

        throw new ForbiddenException(`Missing permission: ${module}.${action}`);
    }
}
