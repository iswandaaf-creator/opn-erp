/**
 * Centralized Error Codes for OpenERP System
 * Format: MODULE_ERROR_NUMBER (e.g., AUTH001, DB001)
 */

export enum ErrorCode {
    // Authentication Errors (AUTH)
    AUTH001 = 'AUTH001', // Invalid credentials
    AUTH002 = 'AUTH002', // Token expired
    AUTH003 = 'AUTH003', // Token invalid
    AUTH004 = 'AUTH004', // Insufficient permissions
    AUTH005 = 'AUTH005', // Account locked
    AUTH006 = 'AUTH006', // Account not found

    // Database Errors (DB)
    DB001 = 'DB001', // Connection failed
    DB002 = 'DB002', // Query failed
    DB003 = 'DB003', // Record not found
    DB004 = 'DB004', // Duplicate entry
    DB005 = 'DB005', // Foreign key constraint

    // Validation Errors (VAL)
    VAL001 = 'VAL001', // Required field missing
    VAL002 = 'VAL002', // Invalid format
    VAL003 = 'VAL003', // Value out of range
    VAL004 = 'VAL004', // Invalid email format
    VAL005 = 'VAL005', // Password too weak

    // Email Errors (EMAIL)
    EMAIL001 = 'EMAIL001', // SMTP connection failed
    EMAIL002 = 'EMAIL002', // Failed to send email
    EMAIL003 = 'EMAIL003', // Invalid recipient
    EMAIL004 = 'EMAIL004', // Email not found

    // Chat Errors (CHAT)
    CHAT001 = 'CHAT001', // WebSocket connection failed
    CHAT002 = 'CHAT002', // Message send failed
    CHAT003 = 'CHAT003', // Conversation not found

    // Sales Errors (SALES)
    SALES001 = 'SALES001', // Order creation failed
    SALES002 = 'SALES002', // Invalid order status transition
    SALES003 = 'SALES003', // Insufficient stock
    SALES004 = 'SALES004', // Quotation expired

    // Inventory Errors (INV)
    INV001 = 'INV001', // Item not found
    INV002 = 'INV002', // Insufficient quantity
    INV003 = 'INV003', // Stock ledger update failed

    // General Errors (GEN)
    GEN001 = 'GEN001', // Internal server error
    GEN002 = 'GEN002', // Service unavailable
    GEN003 = 'GEN003', // Rate limit exceeded
    GEN004 = 'GEN004', // Invalid request
}

export const ErrorMessages: Record<ErrorCode, string> = {
    [ErrorCode.AUTH001]: 'Invalid email or password',
    [ErrorCode.AUTH002]: 'Your session has expired. Please login again',
    [ErrorCode.AUTH003]: 'Invalid authentication token',
    [ErrorCode.AUTH004]: 'You do not have permission to perform this action',
    [ErrorCode.AUTH005]: 'Your account has been locked. Contact administrator',
    [ErrorCode.AUTH006]: 'Account not found',

    [ErrorCode.DB001]: 'Database connection failed',
    [ErrorCode.DB002]: 'Database query failed',
    [ErrorCode.DB003]: 'Record not found',
    [ErrorCode.DB004]: 'Duplicate entry exists',
    [ErrorCode.DB005]: 'Cannot delete - related records exist',

    [ErrorCode.VAL001]: 'Required field is missing',
    [ErrorCode.VAL002]: 'Invalid format provided',
    [ErrorCode.VAL003]: 'Value is out of acceptable range',
    [ErrorCode.VAL004]: 'Invalid email format',
    [ErrorCode.VAL005]: 'Password does not meet security requirements',

    [ErrorCode.EMAIL001]: 'Email service connection failed',
    [ErrorCode.EMAIL002]: 'Failed to send email',
    [ErrorCode.EMAIL003]: 'Invalid email recipient',
    [ErrorCode.EMAIL004]: 'Email not found',

    [ErrorCode.CHAT001]: 'Chat connection failed',
    [ErrorCode.CHAT002]: 'Failed to send message',
    [ErrorCode.CHAT003]: 'Conversation not found',

    [ErrorCode.SALES001]: 'Failed to create order',
    [ErrorCode.SALES002]: 'Invalid order status change',
    [ErrorCode.SALES003]: 'Insufficient stock for this order',
    [ErrorCode.SALES004]: 'This quotation has expired',

    [ErrorCode.INV001]: 'Inventory item not found',
    [ErrorCode.INV002]: 'Insufficient quantity in stock',
    [ErrorCode.INV003]: 'Failed to update stock ledger',

    [ErrorCode.GEN001]: 'An unexpected error occurred',
    [ErrorCode.GEN002]: 'Service temporarily unavailable',
    [ErrorCode.GEN003]: 'Too many requests. Please wait',
    [ErrorCode.GEN004]: 'Invalid request format',
};

export interface AppError {
    code: ErrorCode;
    message: string;
    timestamp: Date;
    path?: string;
    details?: any;
}

export function createAppError(code: ErrorCode, details?: any, path?: string): AppError {
    return {
        code,
        message: ErrorMessages[code],
        timestamp: new Date(),
        path,
        details,
    };
}
