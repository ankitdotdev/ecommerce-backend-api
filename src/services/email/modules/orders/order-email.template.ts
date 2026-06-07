// ORDER RECEIVED EMAIL TEMPLATE FOR CUSTOMER

export const orderReceivedTemplate = ({
  companyName,
  customerName,
  orderNumber,
  totalAmount,
}: {
  companyName: string;
  customerName: string;
  orderNumber: string;
  totalAmount: number;
}) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto;">
      
      <h2>🛒 We've Received Your Order</h2>

      <p>Hi ${customerName},</p>

      <p>
        Thank you for shopping with
        <strong>${companyName}</strong>.
      </p>

      <p>
        We've successfully received your order request.
      </p>

      <div style="
        background:#f5f5f5;
        padding:16px;
        border-radius:8px;
        margin:20px 0;
      ">
        <p>
          <strong>Order Number:</strong>
          ${orderNumber}
        </p>

        <p>
          <strong>Amount Due:</strong>
          ₹${totalAmount}
        </p>

        <p>
          <strong>Payment Status:</strong>
          Pending
        </p>
      </div>

      <p>
        Your order will be confirmed once payment is completed successfully.
      </p>

      <p>
        After payment, you'll receive another email confirming your order and we'll begin processing it.
      </p>

      <br />

      <p>
        Thanks,<br/>
        Team ${companyName}
      </p>

    </div>
  `;
};

// ORDER RECEIVED EMAIL TEMPLATE FOR ADMIN
export const orderReceivedAdminTemplate = ({
  customerName,
  customerEmail,
  orderNumber,
  totalAmount,
}: {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  totalAmount: number;
}) => {
  return `
    <div style="font-family: Arial, sans-serif;">
      
      <h2>🛒 New Order Received</h2>

      <p>A customer has created a new order.</p>

      <p>
        <strong>Order Number:</strong>
        ${orderNumber}
      </p>

      <p>
        <strong>Customer Name:</strong>
        ${customerName}
      </p>

      <p>
        <strong>Customer Email:</strong>
        ${customerEmail}
      </p>

      <p>
        <strong>Total Amount:</strong>
        ₹${totalAmount}
      </p>

      <p>
        <strong>Payment Status:</strong>
        Pending
      </p>

      <p>
        Waiting for payment confirmation.
      </p>

    </div>
  `;
};

// ORDER_STATUS_UPDATE ________________________________________________

export const orderStatusUpdateTemplate = ({
  companyName,
  customerName,
  orderNumber,
  status,
  message,
  note,
}: {
  companyName: string;
  customerName: string;
  orderNumber: string;
  status: string;
  message: string;
  note?: string;
}) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto;">

      <h2>${message}</h2>

      <p>Hi ${customerName},</p>

      <p>
        Your order status has been updated.
      </p>

      <div
        style="
          background:#f5f5f5;
          padding:16px;
          border-radius:8px;
          margin:20px 0;
        "
      >
        <p>
          <strong>Order Number:</strong>
          ${orderNumber}
        </p>

        <p>
          <strong>Status:</strong>
          ${status.toUpperCase()}
        </p>

        ${
          note
            ? `
        <p>
          <strong>Note:</strong>
          ${note}
        </p>
        `
            : ""
        }
      </div>

      <p>
        Thank you for shopping with ${companyName}.
      </p>

      <br />

      <p>
        Regards,<br />
        Team ${companyName}
      </p>

    </div>
  `;
};



