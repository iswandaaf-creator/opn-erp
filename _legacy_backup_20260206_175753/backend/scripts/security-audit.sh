#!/bin/bash

# ============================================
# OpenERP Security Audit Script
# Run: chmod +x scripts/security-audit.sh && ./scripts/security-audit.sh
# ============================================

echo "============================================"
echo "       OpenERP Security Audit"
echo "============================================"
echo ""

ERRORS=0
WARNINGS=0

# Check for hardcoded credentials
echo "🔍 Checking for hardcoded credentials..."
HARDCODED=$(grep -r "password.*=.*['\"]" src --include="*.ts" --include="*.tsx" | grep -v ".spec.ts" | grep -v "passwordHash" | grep -v "// " | wc -l)
if [ "$HARDCODED" -gt 0 ]; then
    echo "❌ Found potential hardcoded passwords: $HARDCODED occurrences"
    grep -r "password.*=.*['\"]" src --include="*.ts" --include="*.tsx" | grep -v ".spec.ts" | grep -v "passwordHash" | grep -v "// " | head -5
    ((ERRORS++))
else
    echo "✅ No hardcoded passwords found"
fi

# Check for JWT secret
echo ""
echo "🔍 Checking JWT configuration..."
if [ -z "$JWT_SECRET" ]; then
    echo "⚠️  JWT_SECRET not set in environment"
    ((WARNINGS++))
else
    if [ ${#JWT_SECRET} -lt 32 ]; then
        echo "⚠️  JWT_SECRET is too short (minimum 32 characters recommended)"
        ((WARNINGS++))
    else
        echo "✅ JWT_SECRET is configured properly"
    fi
fi

# Check for sensitive files
echo ""
echo "🔍 Checking for sensitive files in repository..."
SENSITIVE_FILES=(".env" ".env.local" "*.pem" "*.key" "id_rsa")
for pattern in "${SENSITIVE_FILES[@]}"; do
    FOUND=$(find . -name "$pattern" 2>/dev/null | grep -v node_modules | wc -l)
    if [ "$FOUND" -gt 0 ]; then
        echo "⚠️  Found sensitive file pattern '$pattern'"
        ((WARNINGS++))
    fi
done
echo "✅ Sensitive file check complete"

# Check for console.log statements (potential info leak)
echo ""
echo "🔍 Checking for console.log statements..."
CONSOLE_LOGS=$(grep -r "console.log" src --include="*.ts" | grep -v ".spec.ts" | wc -l)
if [ "$CONSOLE_LOGS" -gt 10 ]; then
    echo "⚠️  Found $CONSOLE_LOGS console.log statements (consider removing in production)"
    ((WARNINGS++))
else
    echo "✅ Console.log usage is minimal"
fi

# Check for TODO/FIXME security notes
echo ""
echo "🔍 Checking for security-related TODOs..."
SECURITY_TODOS=$(grep -r -i "TODO.*security\|FIXME.*security\|TODO.*auth\|FIXME.*auth" src --include="*.ts" | wc -l)
if [ "$SECURITY_TODOS" -gt 0 ]; then
    echo "⚠️  Found $SECURITY_TODOS security-related TODOs"
    grep -r -i "TODO.*security\|FIXME.*security\|TODO.*auth\|FIXME.*auth" src --include="*.ts" | head -5
    ((WARNINGS++))
else
    echo "✅ No security TODOs found"
fi

# Check CORS configuration
echo ""
echo "🔍 Checking CORS configuration..."
CORS_STAR=$(grep -r "origin.*['\"]\\*['\"]" src --include="*.ts" | wc -l)
if [ "$CORS_STAR" -gt 0 ]; then
    echo "⚠️  Found CORS with origin '*' - restrict in production"
    ((WARNINGS++))
else
    echo "✅ CORS is not using wildcard origin"
fi

# Summary
echo ""
echo "============================================"
echo "           AUDIT SUMMARY"
echo "============================================"
echo "Errors:   $ERRORS"
echo "Warnings: $WARNINGS"
echo ""

if [ "$ERRORS" -gt 0 ]; then
    echo "❌ FAILED - Critical security issues found"
    exit 1
elif [ "$WARNINGS" -gt 5 ]; then
    echo "⚠️  PASSED WITH WARNINGS - Review recommended"
    exit 0
else
    echo "✅ PASSED - Security audit complete"
    exit 0
fi
