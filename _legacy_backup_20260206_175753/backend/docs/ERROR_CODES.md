# Error Codes Documentation

## Overview
OpenERP uses standardized error codes across the application for consistent error handling and debugging.

## Error Code Format
`MODULE_NUMBER` (e.g., AUTH001, DB003)

---

## Authentication Errors (AUTH)

| Code | Message | Description |
|------|---------|-------------|
| AUTH001 | Invalid email or password | Login credentials incorrect |
| AUTH002 | Session expired | JWT token has expired |
| AUTH003 | Invalid token | JWT token is malformed |
| AUTH004 | Insufficient permissions | User lacks required role |
| AUTH005 | Account locked | Too many failed attempts |
| AUTH006 | Account not found | Email not registered |

---

## Database Errors (DB)

| Code | Message | Description |
|------|---------|-------------|
| DB001 | Connection failed | Cannot connect to database |
| DB002 | Query failed | SQL query execution error |
| DB003 | Record not found | Entity does not exist |
| DB004 | Duplicate entry | Unique constraint violation |
| DB005 | Cannot delete | Foreign key constraint |

---

## Validation Errors (VAL)

| Code | Message | Description |
|------|---------|-------------|
| VAL001 | Required field missing | Mandatory field not provided |
| VAL002 | Invalid format | Data format incorrect |
| VAL003 | Value out of range | Number exceeds limits |
| VAL004 | Invalid email | Email format incorrect |
| VAL005 | Password too weak | Password requirements not met |

---

## Email Errors (EMAIL)

| Code | Message | Description |
|------|---------|-------------|
| EMAIL001 | SMTP connection failed | Cannot connect to mail server |
| EMAIL002 | Send failed | Email delivery error |
| EMAIL003 | Invalid recipient | Email address invalid |
| EMAIL004 | Email not found | Email ID does not exist |

---

## Chat Errors (CHAT)

| Code | Message | Description |
|------|---------|-------------|
| CHAT001 | WebSocket failed | Real-time connection error |
| CHAT002 | Message send failed | Cannot deliver message |
| CHAT003 | Conversation not found | Chat room does not exist |

---

## Sales Errors (SALES)

| Code | Message | Description |
|------|---------|-------------|
| SALES001 | Order creation failed | Cannot create order |
| SALES002 | Invalid status change | Invalid order transition |
| SALES003 | Insufficient stock | Not enough inventory |
| SALES004 | Quotation expired | Quote validity passed |

---

## Inventory Errors (INV)

| Code | Message | Description |
|------|---------|-------------|
| INV001 | Item not found | Product does not exist |
| INV002 | Insufficient quantity | Stock too low |
| INV003 | Ledger update failed | Stock tracking error |

---

## General Errors (GEN)

| Code | Message | Description |
|------|---------|-------------|
| GEN001 | Internal server error | Unexpected server error |
| GEN002 | Service unavailable | Server temporarily down |
| GEN003 | Rate limit exceeded | Too many requests |
| GEN004 | Invalid request | Malformed request body |
