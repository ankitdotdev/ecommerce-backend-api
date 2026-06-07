import PDFDocument from "pdfkit";

import { IOrder } from "../../modules/orders/orders.interface";
import { IPayment } from "../../modules/payments/payments.interface";

// ==================================================
// THEME CONFIGURATION
// To change the visual theme of the invoice, simply
// update the values in this object. All colors,
// fonts, and spacing are sourced from here.
// ==================================================
const THEME = {
  colors: {
    primary: "#1a1a2e",      // Dark navy — used for header background & section titles
    accent: "#e94560",       // Red accent — used for the top header stripe
    text: "#2d2d2d",         // Main body text color
    muted: "#6b7280",        // Secondary / muted text (labels, footer)
    white: "#ffffff",        // Text on dark backgrounds
    divider: "#e5e7eb",      // Horizontal rule / divider lines
    rowAlt: "#f9fafb",       // Alternate row background for item table
    badge: {
      paid: "#16a34a",       // Green — PAID status badge
      pending: "#d97706",    // Amber — PENDING status badge
      failed: "#dc2626",     // Red — FAILED status badge
    },
  },
  fonts: {
    regular: "Helvetica",
    bold: "Helvetica-Bold",
    oblique: "Helvetica-Oblique",
  },
  spacing: {
    pageMargin: 50,          // Outer page margin (pt)
    sectionGap: 20,          // Vertical gap between major sections
    rowPadding: 8,           // Padding inside table rows
  },
  fontSize: {
    hero: 28,                // "INVOICE" title
    sectionTitle: 11,        // Section header labels
    body: 10,                // Standard body text
    small: 9,                // Footer / disclaimer text
    badge: 9,                // Status badge text
  },
};

// ==================================================
// HELPERS
// ==================================================

/**
 * Draws a full-width horizontal rule (thin line).
 * @param doc      - The PDFDocument instance
 * @param y        - Vertical position (pt). Defaults to current cursor position.
 * @param color    - Hex color string for the line.
 */
const drawDivider = (
  doc: PDFKit.PDFDocument,
  y?: number,
  color: string = THEME.colors.divider,
) => {
  const posY = y ?? doc.y;
  doc
    .save()
    .strokeColor(color)
    .lineWidth(0.5)
    .moveTo(THEME.spacing.pageMargin, posY)
    .lineTo(doc.page.width - THEME.spacing.pageMargin, posY)
    .stroke()
    .restore();
};

/**
 * Draws a filled rectangle spanning the full page width.
 * Used for section header backgrounds.
 * @param doc    - The PDFDocument instance
 * @param y      - Top edge of the rectangle
 * @param height - Rectangle height in pt
 * @param color  - Fill color
 */
const drawBand = (
  doc: PDFKit.PDFDocument,
  y: number,
  height: number,
  color: string,
) => {
  doc
    .save()
    .rect(THEME.spacing.pageMargin, y, doc.page.width - THEME.spacing.pageMargin * 2, height)
    .fill(color)
    .restore();
};

/**
 * Returns the badge color for a given payment status string.
 * Defaults to the muted color for unknown statuses.
 */
const getStatusColor = (status: string): string => {
  const s = status.toLowerCase();
  if (s === "paid" || s === "captured") return THEME.colors.badge.paid;
  if (s === "pending") return THEME.colors.badge.pending;
  if (s === "failed") return THEME.colors.badge.failed;
  return THEME.colors.muted;
};

/**
 * Draws a rounded pill / badge with text (e.g., "PAID", "PENDING").
 * @param doc   - The PDFDocument instance
 * @param text  - Badge label text
 * @param x     - Left edge of badge
 * @param y     - Top edge of badge
 * @param color - Fill color of the badge
 */
const drawBadge = (
  doc: PDFKit.PDFDocument,
  text: string,
  x: number,
  y: number,
  color: string,
) => {
  const padding = { x: 8, y: 4 };
  const badgeWidth = 70;
  const badgeHeight = 16;

  doc
    .save()
    .roundedRect(x, y, badgeWidth, badgeHeight, 4)
    .fill(color);

  doc
    .fillColor(THEME.colors.white)
    .font(THEME.fonts.bold)
    .fontSize(THEME.fontSize.badge)
    .text(text.toUpperCase(), x, y + padding.y, {
      width: badgeWidth,
      align: "center",
    })
    .restore();
};

/**
 * Draws a two-column key-value row with optional alternating background.
 * @param doc         - The PDFDocument instance
 * @param label       - Left-side label text
 * @param value       - Right-side value text
 * @param y           - Top edge of the row
 * @param altRow      - Whether to shade this row with the alternate row color
 */
const drawKeyValueRow = (
  doc: PDFKit.PDFDocument,
  label: string,
  value: string,
  y: number,
  altRow = false,
) => {
  const rowHeight = 20;
  const colWidth = (doc.page.width - THEME.spacing.pageMargin * 2) / 2;

  if (altRow) {
    doc
      .save()
      .rect(THEME.spacing.pageMargin, y, doc.page.width - THEME.spacing.pageMargin * 2, rowHeight)
      .fill(THEME.colors.rowAlt)
      .restore();
  }

  doc
    .fillColor(THEME.colors.muted)
    .font(THEME.fonts.regular)
    .fontSize(THEME.fontSize.body)
    .text(label, THEME.spacing.pageMargin + 6, y + 5, { width: colWidth - 10 });

  doc
    .fillColor(THEME.colors.text)
    .font(THEME.fonts.bold)
    .fontSize(THEME.fontSize.body)
    .text(value, THEME.spacing.pageMargin + colWidth, y + 5, {
      width: colWidth - 10,
      align: "right",
    });

  return y + rowHeight;
};

// ==================================================
// SECTION RENDERERS
// ==================================================

/**
 * Renders the top header block:
 *  - A dark navy background band with the "INVOICE" title and branding accent stripe.
 *  - Order number, invoice date, and payment status badge.
 */
const renderHeader = (doc: PDFKit.PDFDocument, order: IOrder) => {
  const headerHeight = 90;

  // Accent stripe (top-left corner)
  doc
    .save()
    .rect(THEME.spacing.pageMargin, THEME.spacing.pageMargin, 4, headerHeight)
    .fill(THEME.colors.accent)
    .restore();

  // Dark background band
  drawBand(doc, THEME.spacing.pageMargin, headerHeight, THEME.colors.primary);

  // "INVOICE" hero text
  doc
    .fillColor(THEME.colors.white)
    .font(THEME.fonts.bold)
    .fontSize(THEME.fontSize.hero)
    .text("INVOICE", THEME.spacing.pageMargin + 20, THEME.spacing.pageMargin + 18, {
      align: "left",
    });

  // Order number
  doc
    .fillColor(THEME.colors.divider)
    .font(THEME.fonts.regular)
    .fontSize(THEME.fontSize.body)
    .text(
      `Order #${order.orderNumber}`,
      THEME.spacing.pageMargin + 20,
      THEME.spacing.pageMargin + 52,
    );

  // Invoice date (right-aligned within header)
  doc
    .fillColor(THEME.colors.white)
    .font(THEME.fonts.regular)
    .fontSize(THEME.fontSize.body)
    .text(
      `Date: ${new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}`,
      THEME.spacing.pageMargin,
      THEME.spacing.pageMargin + 34,
      { align: "right", width: doc.page.width - THEME.spacing.pageMargin * 2 - 10 },
    );

  // Payment status badge (top-right corner of header)
  const badgeX = doc.page.width - THEME.spacing.pageMargin - 80;
  const badgeY = THEME.spacing.pageMargin + 54;
  drawBadge(doc, order.paymentStatus, badgeX, badgeY, getStatusColor(order.paymentStatus));

  // Move cursor below the header band
  doc.y = THEME.spacing.pageMargin + headerHeight + THEME.spacing.sectionGap;
};

/**
 * Renders a labeled section title bar (e.g., "SHIPPING ADDRESS").
 * Uses a light divider line and an uppercase bold label.
 */
const renderSectionTitle = (doc: PDFKit.PDFDocument, title: string) => {
  const y = doc.y;

  doc
    .fillColor(THEME.colors.primary)
    .font(THEME.fonts.bold)
    .fontSize(THEME.fontSize.sectionTitle)
    .text(title.toUpperCase(), THEME.spacing.pageMargin, y);

  doc.moveDown(0.3);
  drawDivider(doc, doc.y, THEME.colors.primary);
  doc.moveDown(0.8);
};

/**
 * Renders the shipping address block in a clean two-line layout.
 */
const renderShippingAddress = (doc: PDFKit.PDFDocument, order: IOrder) => {
  renderSectionTitle(doc, "Shipping Address");

  const { shippingAddress } = order;
  const lines: string[] = [
    shippingAddress.addressLine1,
    ...(shippingAddress.addressLine2 ? [shippingAddress.addressLine2] : []),
    `${shippingAddress.city}, ${shippingAddress.state}`,
    `${shippingAddress.country} — ${shippingAddress.postalCode}`,
  ];

  lines.forEach((line) => {
    doc
      .fillColor(THEME.colors.text)
      .font(THEME.fonts.regular)
      .fontSize(THEME.fontSize.body)
      .text(line, THEME.spacing.pageMargin + 4);
  });

  doc.moveDown(THEME.spacing.sectionGap / 10);
};

/**
 * Renders the order items table with:
 *  - A shaded header row (Item | Qty | Unit Price | Subtotal)
 *  - Alternating row backgrounds for readability
 *  - Right-aligned price columns
 */
const renderOrderItems = (doc: PDFKit.PDFDocument, order: IOrder) => {
  doc.moveDown(1.5);
  renderSectionTitle(doc, "Order Items");

  const margin = THEME.spacing.pageMargin;
  const tableWidth = doc.page.width - margin * 2;
  const colWidths = {
    name: tableWidth * 0.44,
    qty: tableWidth * 0.12,
    price: tableWidth * 0.22,
    subtotal: tableWidth * 0.22,
  };
  const rowHeight = 22;

  // --- Table header row ---
  const headerY = doc.y;
  doc
    .save()
    .rect(margin, headerY, tableWidth, rowHeight)
    .fill(THEME.colors.primary)
    .restore();

  const headerLabels: [string, number, "left" | "right"][] = [
    ["Item", margin + 6, "left"],
    ["Qty", margin + colWidths.name, "right"],
    ["Unit Price (₹)", margin + colWidths.name + colWidths.qty, "right"],
    ["Subtotal (₹)", margin + colWidths.name + colWidths.qty + colWidths.price, "right"],
  ];

  headerLabels.forEach(([label, x, align]) => {
    const colW =
      label === "Item"
        ? colWidths.name
        : label === "Qty"
        ? colWidths.qty
        : label === "Unit Price (₹)"
        ? colWidths.price
        : colWidths.subtotal;

    doc
      .fillColor(THEME.colors.white)
      .font(THEME.fonts.bold)
      .fontSize(THEME.fontSize.body)
      .text(label, x, headerY + 6, { width: colW - 6, align });
  });

  let rowY = headerY + rowHeight;

  // --- Data rows ---
  order.items.forEach((item, index) => {
    const isAlt = index % 2 === 1;

    if (isAlt) {
      doc
        .save()
        .rect(margin, rowY, tableWidth, rowHeight)
        .fill(THEME.colors.rowAlt)
        .restore();
    }

    doc
      .fillColor(THEME.colors.text)
      .font(THEME.fonts.regular)
      .fontSize(THEME.fontSize.body)
      .text(item.name, margin + 6, rowY + 6, { width: colWidths.name - 10, ellipsis: true });

    doc
      .text(String(item.quantity), margin + colWidths.name, rowY + 6, {
        width: colWidths.qty - 6,
        align: "right",
      });

    doc
      .text(item.price.toLocaleString("en-IN"), margin + colWidths.name + colWidths.qty, rowY + 6, {
        width: colWidths.price - 6,
        align: "right",
      });

    doc
      .font(THEME.fonts.bold)
      .text(
        item.subtotal.toLocaleString("en-IN"),
        margin + colWidths.name + colWidths.qty + colWidths.price,
        rowY + 6,
        { width: colWidths.subtotal - 6, align: "right" },
      );

    rowY += rowHeight;
  });

  doc.y = rowY + THEME.spacing.sectionGap / 2;
};

/**
 * Renders the order totals block (Subtotal + Grand Total).
 * Grand Total is emphasized with a larger font and primary color.
 */
const renderTotals = (doc: PDFKit.PDFDocument, order: IOrder) => {
  const margin = THEME.spacing.pageMargin;
  const tableWidth = doc.page.width - margin * 2;

  doc.moveDown(0.5);
  drawDivider(doc);
  doc.moveDown(0.5);

  // Subtotal row
  let y = doc.y;
  doc
    .fillColor(THEME.colors.muted)
    .font(THEME.fonts.regular)
    .fontSize(THEME.fontSize.body)
    .text("Subtotal", margin, y);

  doc
    .fillColor(THEME.colors.text)
    .font(THEME.fonts.bold)
    .fontSize(THEME.fontSize.body)
    .text(`₹ ${order.subtotal.toLocaleString("en-IN")}`, margin, y, {
      align: "right",
      width: tableWidth,
    });

  doc.moveDown(0.6);

  // Grand Total row (highlighted)
  y = doc.y;
  doc
    .fillColor(THEME.colors.primary)
    .font(THEME.fonts.bold)
    .fontSize(13)
    .text("Grand Total", margin, y);

  doc
    .fillColor(THEME.colors.accent)
    .font(THEME.fonts.bold)
    .fontSize(13)
    .text(`₹ ${order.totalAmount.toLocaleString("en-IN")}`, margin, y, {
      align: "right",
      width: tableWidth,
    });

  doc.moveDown(1.5);
};

/**
 * Renders the payment details section as a clean key-value grid
 * with alternating row highlights for readability.
 */
const renderPaymentDetails = (doc: PDFKit.PDFDocument, payment: IPayment) => {
  renderSectionTitle(doc, "Payment Details");

  const rows: [string, string][] = [
    ["Payment Provider", payment.provider],
    ["Payment Status", payment.status.toUpperCase()],
    ...(payment.razorpayPaymentId
      ? [["Payment ID", payment.razorpayPaymentId] as [string, string]]
      : []),
    ...(payment.paidAt
      ? [
          [
            "Paid On",
            payment.paidAt.toLocaleString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          ] as [string, string],
        ]
      : []),
  ];

  let y = doc.y;
  rows.forEach(([label, value], index) => {
    y = drawKeyValueRow(doc, label, value, y, index % 2 === 1);
  });

  doc.y = y + THEME.spacing.sectionGap;
};

/**
 * Renders the footer disclaimer at the bottom of the invoice.
 */
const renderFooter = (doc: PDFKit.PDFDocument) => {
  // Place footer near the page bottom regardless of content length
  const footerY = doc.page.height - THEME.spacing.pageMargin - 40;

  drawDivider(doc, footerY - 10);

  doc
    .fillColor(THEME.colors.muted)
    .font(THEME.fonts.oblique)
    .fontSize(THEME.fontSize.small)
    .text(
      "This is a system-generated invoice and does not require a signature.",
      THEME.spacing.pageMargin,
      footerY,
      {
        align: "center",
        width: doc.page.width - THEME.spacing.pageMargin * 2,
      },
    );

  doc
    .fillColor(THEME.colors.divider)
    .font(THEME.fonts.regular)
    .fontSize(THEME.fontSize.small)
    .text("Thank you for your purchase.", THEME.spacing.pageMargin, footerY + 14, {
      align: "center",
      width: doc.page.width - THEME.spacing.pageMargin * 2,
    });
};

// ==================================================
// MAIN EXPORT
// ==================================================

/**
 * Generates a professional PDF invoice for a given order and payment.
 *
 * @param order   - The order object (items, shipping address, totals, etc.)
 * @param payment - The payment object (provider, status, Razorpay ID, etc.)
 * @returns       - A Promise resolving to a Buffer containing the PDF binary.
 *
 * Usage:
 *   const pdfBuffer = await generateInvoicePdf(order, payment);
 *   res.setHeader("Content-Type", "application/pdf");
 *   res.send(pdfBuffer);
 */
export const generateInvoicePdf = async (
  order: IOrder,
  payment: IPayment,
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      // Initialize the PDF document with A4 size and custom margins
      const doc = new PDFDocument({
        margin: THEME.spacing.pageMargin,
        size: "A4",
        info: {
          Title: `Invoice - ${order.orderNumber}`,
          Author: "Your Company Name",    // ← Update with your company name
          Subject: "Order Invoice",
          Creator: "Invoice Generator",
        },
      });

      const buffers: Buffer[] = [];

      // Collect PDF chunks as they are emitted
      doc.on("data", (chunk: Buffer) => buffers.push(chunk));

      // When the document stream ends, resolve the promise with the full buffer
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // --------------------------------------------------
      // Render each section in order
      // --------------------------------------------------
      renderHeader(doc, order);
      renderShippingAddress(doc, order);
      renderOrderItems(doc, order);
      renderTotals(doc, order);
      renderPaymentDetails(doc, payment);
      renderFooter(doc);

      // Finalize and close the PDF stream
      doc.end();
    } catch (error) {
      // Propagate any synchronous errors to the caller via promise rejection
      reject(error);
    }
  });
};