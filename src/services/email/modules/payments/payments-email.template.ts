export const paymentSuccessUserTemplate = ({
  companyName,
  customerName,
  orderNumber,
  amount,
}: {
  companyName: string;
  customerName: string;
  orderNumber: string;
  amount: number;
}) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto;">

      <h2>🎉 Payment Received</h2>

      <p>Hi ${customerName},</p>

      <p>
        We've successfully received your payment.
      </p>

      <p>
        Your order has now been
        <strong>confirmed</strong>.
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
          <strong>Amount Paid:</strong>
          ₹${amount}
        </p>

        <p>
          <strong>Payment Status:</strong>
          Paid
        </p>

        <p>
          <strong>Order Status:</strong>
          Confirmed
        </p>
      </div>

      <p>
        Our team has started processing your order.
      </p>

      <p>
        We'll notify you once your order is shipped.
      </p>

      <br />

      <p>
        Thank you for shopping with
        ${companyName}.
      </p>

    </div>
  `;
};


export const paymentSuccessAdminTemplate = ({
  customerName,
  customerEmail,
  orderNumber,
  amount,
}: {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  amount: number;
}) => {
  return `
    <div style="font-family: Arial, sans-serif;">

      <h2>💰 Payment Received</h2>

      <p>
        Payment has been received for an order.
      </p>

      <p>
        <strong>Order Number:</strong>
        ${orderNumber}
      </p>

      <p>
        <strong>Customer:</strong>
        ${customerName}
      </p>

      <p>
        <strong>Email:</strong>
        ${customerEmail}
      </p>

      <p>
        <strong>Amount:</strong>
        ₹${amount}
      </p>

      <p>
        <strong>Status:</strong>
        Paid / Confirmed
      </p>

    </div>
  `;
};