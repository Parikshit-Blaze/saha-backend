const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/orders", async (req, res) => {
  try {
    const order = req.body;
    console.log("Order received:", order);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: "New Website Order",
      text: `
NEW ORDER RECEIVED

Name: ${order.name}
Phone: ${order.phone}
Email: ${order.email}

Project Type: ${order.project}
Area: ${order.area}
Location: ${order.location}

Products:
${order.cart}

Notes:
${order.notes}
      `,
    };

    await transporter.sendMail(mailOptions);
    if (order.email) {

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: order.email,
      subject: "We Received Your Enquiry - Saha & Co.",
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px">
          <h2 style="color:#8B7355;">Thank You for Contacting Saha & Co.</h2>

          <p>Dear ${order.name},</p>

          <p>We have successfully received your enquiry for paver blocks / kerb stones.</p>

          <h3>Order Summary</h3>

          <p><strong>Project Type:</strong> ${order.project}</p>
          <p><strong>Location:</strong> ${order.location}</p>
          <p><strong>Products:</strong> ${order.cart}</p>

          <p>Our team will contact you within 4 working hours.</p>

          <br>

          <p>
            Regards,<br>
            <strong>Saha & Co.</strong><br>
            Premium Paver Blocks & Kerb Stones
          </p>
        </div>
      `
      });

      }


    res.status(200).json({
      success: true,
      message: "Order submitted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});