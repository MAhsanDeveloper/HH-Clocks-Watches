import PDFDocument from "pdfkit";

export const generateInvoice = (order, stream) => {
  const doc = new PDFDocument({ margin: 50 });

  doc.pipe(stream);

  // ======= HEADER =======
  doc
    .fontSize(22)
    .font("Helvetica-Bold")
    .text("H Clocks and Watches", { align: "center" })
    .moveDown(0.5);

  doc
    .fontSize(16)
    .font("Helvetica")
    .text("Invoice", { align: "center" })
    .moveDown(1);

  // ======= CUSTOMER INFO =======
  doc
    .fontSize(12)
    .font("Helvetica")
    .text(`Order ID: ${order._id}`)
    .text(`Date: ${new Date(order.createdAt).toLocaleString()}`)
    .text(`Name: ${order.customerName}`)
    .text(`Name: ${order.customerPhone}`)
    .text(`Email: ${order.customerEmail}`)
    .text(`Address: ${order.address}`)
    .text(`Payment Method: ${order.paymentMethod}`)
    .moveDown();

  // ======= TABLE HEADER =======
  const tableTop = doc.y;
  const itemX = 50;
  const qtyX = 280;
  const priceX = 340;
  const subtotalX = 420;

  doc
    .font("Helvetica-Bold")
    .text("Item", itemX, tableTop)
    .text("Qty", qtyX, tableTop)
    .text("Price", priceX, tableTop)
    .text("Subtotal", subtotalX, tableTop);

  doc
    .moveTo(itemX, tableTop + 15)
    .lineTo(550, tableTop + 15)
    .stroke()
    .moveDown(0.5);

  // ======= TABLE BODY =======
  let positionY = tableTop + 25;

  doc.font("Helvetica");

  order.items.forEach((item) => {
    doc
      .text(item.name, itemX, positionY)
      .text(String(item.quantity), qtyX, positionY)
      .text(`Rs. ${item.price}`, priceX, positionY)
      .text(`Rs. ${item.price * item.quantity}`, subtotalX, positionY);
    positionY += 30;
  });

  // ======= TOTAL =======
  doc
    .moveTo(itemX, positionY + 10)
    .lineTo(550, positionY + 10)
    .stroke();

  doc
    .font("Helvetica-Bold")
    .fontSize(13)
    .text(`Total: Rs. ${order.totalAmount}`, subtotalX, positionY + 20, {
      align: "right",
    });

  // ======= FOOTER =======
  doc
    .moveDown(4)
    .fontSize(10)
    .font("Helvetica-Oblique")
    .text("Thank you for shopping at H Clocks and Watches!", {
      align: "center",
    });

  doc.end();
};
