import PDFDocument from "pdfkit";

export const generatePackagingSlip = (order, stream) => {
  const doc = new PDFDocument({ margin: 50 });

  doc.pipe(stream);

  // ======= HEADER =======
  doc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("H Clocks and Watches", { align: "center" })
    .moveDown(1);

  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("Dispatch Invoice", { align: "center" })
    .moveDown(2);

  // ======= RECEIVER INFO =======
  doc
    .fontSize(12)
    .font("Helvetica")
    .text(`Receiver: ${order.customerName}`)
    .moveDown(0.5)
    .text(`Phone: ${order.customerPhone || "-"}`)
    .moveDown(0.5)
    .text(`Email: ${order.customerEmail}`)
    .moveDown(0.5)
    .text("Shipping Address:")
    .text(order.address, { indent: 20 })
    .moveDown(2);

  doc
    .fontSize(10)
    .font("Helvetica-Oblique")
    .text("Please handle with care.", { align: "center" });

  doc.end();
};
