import { Controller, Get } from '@nestjs/common';
import { BuyingService } from '../buying/buying.service';

@Controller('approvals')
export class ApprovalsController {
    constructor(private readonly buyingService: BuyingService) { }

    @Get('pending')
    async getPendingApprovals() {
        // 1. Get Pending POs
        const pendingPOs = await this.buyingService.findAll();
        // Filter logic might be better in service, but for now we filter here or use a dedicated query if available.
        // Assuming BuyingService.findAll returns all. We filter for status 'ORDERED' or 'PENDING_APPROVAL' if that existed.
        // For this context, let's assume 'DRAFT' needs approval to become 'ORDERED', or 'ORDERED' needs approval to be 'RECEIVED'.
        // Let's say we want to highlight 'DRAFT' POs that are waiting to be sent.

        const drafts = pendingPOs.filter(po => po.status === 'DRAFT');

        return {
            purchaseOrders: drafts,
            // leaveRequests: [] // Future
        };
    }
}
