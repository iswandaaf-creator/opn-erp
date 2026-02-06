/**
 * Role-Based Access Control (RBAC) Testing Utilities
 * Run: npx ts-node src/testing/rbac-test.ts
 */

interface RolePermission {
    role: string;
    allowedRoutes: string[];
    deniedRoutes: string[];
}

const rolePermissions: RolePermission[] = [
    {
        role: 'SUPER_ADMIN',
        allowedRoutes: ['/super-admin', '/users', '/settings', '/sales', '/inventory', '/crm', '/accounting', '/hr', '/chat', '/email'],
        deniedRoutes: [],
    },
    {
        role: 'OWNER',
        allowedRoutes: ['/super-admin', '/users', '/settings', '/sales', '/inventory', '/crm', '/accounting', '/hr', '/chat', '/email', '/pos'],
        deniedRoutes: [],
    },
    {
        role: 'MANAGER',
        allowedRoutes: ['/admin', '/sales', '/inventory', '/crm', '/accounting', '/hr', '/chat', '/email', '/pos', '/settings'],
        deniedRoutes: ['/super-admin', '/users'],
    },
    {
        role: 'SALES',
        allowedRoutes: ['/sales', '/crm', '/settings'],
        deniedRoutes: ['/super-admin', '/users', '/inventory', '/accounting', '/hr'],
    },
    {
        role: 'CASHIER',
        allowedRoutes: ['/pos', '/chat', '/settings'],
        deniedRoutes: ['/super-admin', '/users', '/sales', '/inventory', '/accounting', '/hr'],
    },
    {
        role: 'WAREHOUSE',
        allowedRoutes: ['/inventory', '/email', '/chat', '/settings'],
        deniedRoutes: ['/super-admin', '/users', '/sales', '/accounting', '/hr'],
    },
    {
        role: 'FINANCE',
        allowedRoutes: ['/admin', '/accounting', '/email', '/chat', '/settings'],
        deniedRoutes: ['/super-admin', '/users', '/sales', '/inventory', '/hr'],
    },
    {
        role: 'HR_ADMIN',
        allowedRoutes: ['/hr', '/settings'],
        deniedRoutes: ['/super-admin', '/users', '/sales', '/inventory', '/accounting'],
    },
    {
        role: 'USER',
        allowedRoutes: ['/settings'],
        deniedRoutes: ['/super-admin', '/users', '/sales', '/inventory', '/accounting', '/hr'],
    },
];

interface TestResult {
    role: string;
    route: string;
    expected: 'ALLOW' | 'DENY';
    actual: 'ALLOW' | 'DENY';
    passed: boolean;
}

/**
 * Simulate route access check
 */
function checkRouteAccess(role: string, route: string, allowedRoles: string[]): boolean {
    return allowedRoles.includes(role);
}

/**
 * Run RBAC tests
 */
export function runRBACTests(): TestResult[] {
    const results: TestResult[] = [];

    // Route to role mapping (simplified)
    const routeRoleMap: Record<string, string[]> = {
        '/super-admin': ['SUPER_ADMIN', 'OWNER'],
        '/users': ['SUPER_ADMIN', 'OWNER'],
        '/admin': ['MANAGER', 'ADMIN', 'FINANCE', 'SALES', 'PPIC', 'PURCHASING', 'WAREHOUSE', 'QUALITY_CONTROL'],
        '/pos': ['OWNER', 'MANAGER', 'CASHIER'],
        '/sales': ['SUPER_ADMIN', 'OWNER', 'MANAGER', 'SALES', 'SALES_ADMIN', 'WAREHOUSE'],
        '/inventory': ['OWNER', 'MANAGER', 'INVENTORY', 'WAREHOUSE', 'PURCHASING', 'PPIC', 'QUALITY_CONTROL'],
        '/crm': ['OWNER', 'MANAGER', 'SALES', 'SALES_ADMIN'],
        '/accounting': ['OWNER', 'MANAGER', 'FINANCE', 'ACCOUNTANT'],
        '/hr': ['OWNER', 'MANAGER', 'HR_ADMIN'],
        '/chat': ['OWNER', 'MANAGER', 'CASHIER', 'KITCHEN', 'STAFF', 'FINANCE', 'WAREHOUSE'],
        '/email': ['OWNER', 'MANAGER', 'FINANCE', 'WAREHOUSE'],
        '/settings': ['SUPER_ADMIN', 'OWNER', 'MANAGER', 'HR_ADMIN', 'INVENTORY', 'PRODUCTION', 'EMPLOYEE', 'USER', 'CASHIER', 'SALES', 'ACCOUNTANT'],
    };

    for (const perm of rolePermissions) {
        // Test allowed routes
        for (const route of perm.allowedRoutes) {
            const allowedRoles = routeRoleMap[route] || [];
            const actual = checkRouteAccess(perm.role, route, allowedRoles) ? 'ALLOW' : 'DENY';
            results.push({
                role: perm.role,
                route,
                expected: 'ALLOW',
                actual,
                passed: actual === 'ALLOW',
            });
        }

        // Test denied routes
        for (const route of perm.deniedRoutes) {
            const allowedRoles = routeRoleMap[route] || [];
            const actual = checkRouteAccess(perm.role, route, allowedRoles) ? 'ALLOW' : 'DENY';
            results.push({
                role: perm.role,
                route,
                expected: 'DENY',
                actual,
                passed: actual === 'DENY',
            });
        }
    }

    return results;
}

/**
 * Print test results
 */
export function printRBACTestResults(): void {
    const results = runRBACTests();
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;

    console.log('\n========================================');
    console.log('     RBAC TEST RESULTS');
    console.log('========================================\n');

    // Group by role
    const byRole = results.reduce((acc, r) => {
        if (!acc[r.role]) acc[r.role] = [];
        acc[r.role].push(r);
        return acc;
    }, {} as Record<string, TestResult[]>);

    for (const [role, tests] of Object.entries(byRole)) {
        const rolePassed = tests.filter(t => t.passed).length;
        const roleTotal = tests.length;
        const status = rolePassed === roleTotal ? '✅' : '❌';

        console.log(`${status} ${role}: ${rolePassed}/${roleTotal} tests passed`);

        // Show failed tests
        const failedTests = tests.filter(t => !t.passed);
        for (const t of failedTests) {
            console.log(`   ❌ ${t.route}: Expected ${t.expected}, got ${t.actual}`);
        }
    }

    console.log('\n----------------------------------------');
    console.log(`TOTAL: ${passed}/${results.length} tests passed`);
    console.log(`${failed > 0 ? '❌ FAILED' : '✅ ALL PASSED'}`);
    console.log('========================================\n');
}

// Run if executed directly
if (require.main === module) {
    printRBACTestResults();
}
