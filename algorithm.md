# ERP System Algorithms and Data Flow

This document outlines the core logic and data flow between the implementation modules, based on the provided DFD.

## 1. CRM & Sales Cycle
**Flow:** `Lead` -> `Quotation` -> `Sales Order` -> `Invoice`
1.  **Lead Generation**: User creates a Lead.
2.  **Quotation**: Lead is converted to a Quotation with estimated prices.
    *   *Check*: Requires Approval? If yes, Approval Status = PENDING -> APPROVED.
3.  **Sales Order (SO)**: Quotation is converted to a Sales Order.
    *   *Check*: Check Inventory (Stocks).
    *   *Condition*: If Stock "Yes" -> Proceed to Invoice/Dispatch.
    *   *Condition*: If Stock "No" -> Trigger **Production** or **Purchase**.

## 2. Production Cycle (Make to Order)
**Flow:** `Sales Order` -> `Production Work Order` -> `MRP` -> `Job Card`
1.  **Work Order (WO)**: Created from Sales Order or manually for stock.
2.  **MRP (Material Requirements Planning)**:
    *   Analyze BOM (Bill of Materials) for the product.
    *   Calculate required raw materials.
    *   Check `Inventory` for raw materials.
    *   *Output*: Generate `Material Demand Slip`.
3.  **Purchase Requisition**: If Raw Materials missing -> Trigger **Purchase**.
4.  **Job Card**: Assign tasks to workers/machines.
5.  **Daily Entry**: Track progress.
6.  **QC**: Inspection -> Finished Goods Note (FGN).

## 3. Purchase Cycle
**Flow:** `Requisition` -> `Quotation (Vendor)` -> `Purchase Order` -> `GRN`
1.  **Requisition**: Generated manually or from MRP.
2.  **Vendor Selection**: Send RFQ (Request for Quote) -> Receive Quote -> Compare.
3.  **Purchase Order (PO)**: Issue PO to selected vendor.
    *   *Check*: Approval logic.
4.  **Material Receipt (GRN)**: Store receives goods.
    *   *Update*: Inventory Stock Level (+).
    *   *Trigger*: QC Inspection.

## 4. Inventory & Quality Control (QC)
1.  **Inward**: Material Receipt Note (MRN) -> QC Inspection -> Stock In.
2.  **Outward**: Method (FIFO/LIFO) -> Material Issue Slip (to Production) or Dispatch (to Customer).
3.  **Returns**: Return to Vendor (Rejected Material) or Sales Return.

## 5. Finance
**Flow:** `Invoice/Bill` -> `General Ledger`
1.  **Accounts Payable**: Triggered by Approved GRN/Purchase Bill.
2.  **Accounts Receivable**: Triggered by Sales Invoice.
3.  **Journal Entries**: Automated postings for all transactions (Stock movement, Sales, Purchase).
4.  **Asset Management**: Depreciation calculation.

## 6. HR & Payroll
1.  **Attendance**: Linked to Biometric/Manual entry.
2.  **Leave**: Leave Request -> Approval -> Balance Deduction.
3.  **Payroll**:
    *   (Basic + Allowances - Deductions + Overtime).
    *   Output: Salary Slip & Bank Transfer Advice.
