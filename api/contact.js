
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("failed");
  }

  const { name, email, phone, message } = req.body || {};

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof phone !== "string" ||
    typeof message !== "string"
  ) {
    return res.status(400).send("failed");
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanPhone = phone.trim();
  const cleanMessage = message.trim();

  if (
    !cleanName || cleanName.length > 200 ||
    !cleanEmail || cleanEmail.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) ||
    !cleanPhone || cleanPhone.length > 50 ||
    !cleanMessage || cleanMessage.length > 10000
  ) {
    return res.status(400).send("failed");
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Flex & Fuel Website <onboarding@resend.dev>",
      to: ["bikesh17stha@gmail.com"],
      replyTo: cleanEmail,
      subject: "New Contact Message - Flex & Fuel",
      text:
        `Name: ${cleanName}\n` +
        `Email: ${cleanEmail}\n` +
        `Phone: ${cleanPhone}\n\n` +
        `Message:\n${cleanMessage}`,
      html: `
        <h2>New Contact Message - Flex & Fuel</h2>
        <p><strong>Name:</strong> ${escapeHtml(cleanName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(cleanEmail)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(cleanPhone)}</p>
        <p><strong>Message:</strong><br>${escapeHtml(cleanMessage).replace(/\n/g, "<br>")}</p>
      `
    });

    if (error || !data) {
      console.error("Email provider error:", error);
      return res.status(500).send("failed");
    }

    return res.status(200).send("sent");
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).send("failed");
  }
};
