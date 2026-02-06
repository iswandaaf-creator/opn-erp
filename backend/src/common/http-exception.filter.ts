import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCode, ErrorMessages, AppError } from './error-codes';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let errorCode = ErrorCode.GEN001;
        let message = ErrorMessages[ErrorCode.GEN001];
        let details: any = undefined;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const resp = exceptionResponse as any;
                message = resp.message || exception.message;
                errorCode = resp.code || this.mapStatusToErrorCode(status);
                details = resp.details;
            } else {
                message = exceptionResponse as string;
                errorCode = this.mapStatusToErrorCode(status);
            }
        } else if (exception instanceof Error) {
            message = exception.message;
            this.logger.error(`Unhandled error: ${exception.message}`, exception.stack);
        }

        const errorResponse: AppError = {
            code: errorCode,
            message,
            timestamp: new Date(),
            path: request.url,
            details,
        };

        // Log error with context
        this.logger.error(
            `[${errorCode}] ${request.method} ${request.url} - ${message}`,
            details ? JSON.stringify(details) : '',
        );

        response.status(status).json(errorResponse);
    }

    private mapStatusToErrorCode(status: number): ErrorCode {
        switch (status) {
            case 401:
                return ErrorCode.AUTH001;
            case 403:
                return ErrorCode.AUTH004;
            case 404:
                return ErrorCode.DB003;
            case 409:
                return ErrorCode.DB004;
            case 422:
                return ErrorCode.VAL001;
            case 429:
                return ErrorCode.GEN003;
            case 503:
                return ErrorCode.GEN002;
            default:
                return ErrorCode.GEN001;
        }
    }
}
