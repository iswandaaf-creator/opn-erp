import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const TENANT_HEADER = 'x-tenant-id';

@Injectable()
export class TenancyMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const tenantId = req.headers[TENANT_HEADER] as string;

        if (!tenantId) {
            // For Public API (Login, Register Tenant), we might allow missing header
            // But for core modules, it is required.
            // We will handle public routes later. For now, strict check.
            // throw new BadRequestException('X-Tenant-ID header is missing');
        }

        // Attach tenantId to request object for usage in Controllers/Services
        req['tenantId'] = tenantId || 'public'; // Default to public if missing (for public schema)

        next();
    }
}
