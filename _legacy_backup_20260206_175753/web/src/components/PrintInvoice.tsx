import { Button } from '@mui/material';
import { Print as PrintIcon } from '@mui/icons-material';

export const PrintInvoice = ({ order }: { order: any }) => {
    const handlePrint = () => {
        const printWindow = window.open('', '', 'width=800,height=600');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                <head>
                    <title>Invoice #${order.id}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .header { display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
                        .details { margin-bottom: 20px; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        .total { text-align: right; font-weight: bold; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <img src="/logo_long.png" style="max-height: 80px; width: auto;" alt="Open Erp" />
                        </div>
                        <h1>INVOICE</h1>
                        <div>
                            <p><strong>Order ID:</strong> ${order.id}</p>
                            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div class="details">
                        <p><strong>Customer:</strong> ${order.customerName}</p>
                        <p><strong>Status:</strong> ${order.status}</p>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map((item: any) => `
                                <tr>
                                    <td>Product #${item.productId}</td>
                                    <td>${item.quantity}</td>
                                    <td>$${Number(item.price).toFixed(2)}</td>
                                    <td>$${(Number(item.price) * item.quantity).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="total">
                        Total Amount: $${Number(order.totalAmount).toFixed(2)}
                    </div>
                    <script>
                        window.print();
                        window.onafterprint = function() { window.close(); }
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    return (
        <Button
            variant="outlined"
            size="small"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
        >
            Print
        </Button>
    );
};
