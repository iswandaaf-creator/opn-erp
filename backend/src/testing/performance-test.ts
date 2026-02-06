/**
 * Performance Audit Utilities
 * Simple performance testing for API endpoints
 * Run: npx ts-node src/testing/performance-test.ts
 */

interface PerformanceResult {
    endpoint: string;
    method: string;
    avgResponseTime: number;
    minResponseTime: number;
    maxResponseTime: number;
    requestsPerSecond: number;
    successRate: number;
    status: 'PASS' | 'WARN' | 'FAIL';
}

interface TestConfig {
    baseUrl: string;
    endpoints: { path: string; method: string; body?: any }[];
    iterations: number;
    timeout: number;
}

const defaultConfig: TestConfig = {
    baseUrl: process.env.API_URL || 'http://localhost:3000',
    endpoints: [
        { path: '/auth/login', method: 'POST', body: { email: 'admin@erp.com', password: 'password123' } },
        { path: '/products', method: 'GET' },
        { path: '/sales/orders', method: 'GET' },
        { path: '/inventory/ledger', method: 'GET' },
        { path: '/crm/customers', method: 'GET' },
    ],
    iterations: 10,
    timeout: 5000,
};

/**
 * Measure response time for a single request
 */
async function measureRequest(
    url: string,
    method: string,
    body?: any,
    token?: string
): Promise<{ time: number; success: boolean }> {
    const start = performance.now();

    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        const time = performance.now() - start;
        return { time, success: response.ok };
    } catch (error) {
        const time = performance.now() - start;
        return { time, success: false };
    }
}

/**
 * Run performance tests for an endpoint
 */
async function testEndpoint(
    baseUrl: string,
    path: string,
    method: string,
    iterations: number,
    body?: any,
    token?: string
): Promise<PerformanceResult> {
    const url = `${baseUrl}${path}`;
    const times: number[] = [];
    let successes = 0;

    for (let i = 0; i < iterations; i++) {
        const result = await measureRequest(url, method, body, token);
        times.push(result.time);
        if (result.success) successes++;
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const successRate = (successes / iterations) * 100;
    const rps = 1000 / avgTime;

    // Determine status
    let status: 'PASS' | 'WARN' | 'FAIL' = 'PASS';
    if (avgTime > 1000 || successRate < 90) {
        status = 'FAIL';
    } else if (avgTime > 500 || successRate < 95) {
        status = 'WARN';
    }

    return {
        endpoint: `${method} ${path}`,
        method,
        avgResponseTime: Math.round(avgTime),
        minResponseTime: Math.round(minTime),
        maxResponseTime: Math.round(maxTime),
        requestsPerSecond: Math.round(rps * 100) / 100,
        successRate: Math.round(successRate),
        status,
    };
}

/**
 * Run full performance audit
 */
export async function runPerformanceAudit(config: TestConfig = defaultConfig): Promise<void> {
    console.log('\n============================================');
    console.log('     PERFORMANCE AUDIT');
    console.log('============================================');
    console.log(`Base URL: ${config.baseUrl}`);
    console.log(`Iterations per endpoint: ${config.iterations}`);
    console.log('');

    const results: PerformanceResult[] = [];

    for (const endpoint of config.endpoints) {
        console.log(`Testing ${endpoint.method} ${endpoint.path}...`);
        const result = await testEndpoint(
            config.baseUrl,
            endpoint.path,
            endpoint.method,
            config.iterations,
            endpoint.body
        );
        results.push(result);
    }

    // Print results
    console.log('\n----------------------------------------');
    console.log('RESULTS:\n');

    for (const result of results) {
        const icon = result.status === 'PASS' ? '✅' : result.status === 'WARN' ? '⚠️' : '❌';
        console.log(`${icon} ${result.endpoint}`);
        console.log(`   Avg: ${result.avgResponseTime}ms | Min: ${result.minResponseTime}ms | Max: ${result.maxResponseTime}ms`);
        console.log(`   RPS: ${result.requestsPerSecond} | Success: ${result.successRate}%`);
        console.log('');
    }

    // Summary
    const passed = results.filter(r => r.status === 'PASS').length;
    const warned = results.filter(r => r.status === 'WARN').length;
    const failed = results.filter(r => r.status === 'FAIL').length;

    console.log('----------------------------------------');
    console.log(`SUMMARY: ${passed} passed, ${warned} warnings, ${failed} failed`);
    console.log('============================================\n');
}

// Run if executed directly
if (require.main === module) {
    runPerformanceAudit().catch(console.error);
}
