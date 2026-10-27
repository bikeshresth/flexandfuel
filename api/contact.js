
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// Escape user input before inserting it into HTML
function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

module.exports = async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("failed");
  }

  const { name, email, phone, message } = req.body || {};

  // Validate form fields
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
    !cleanName ||
    cleanName.length > 200 ||
    !cleanEmail ||
    cleanEmail.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) ||
    !cleanPhone ||
    cleanPhone.length > 50 ||
    !cleanMessage ||
    cleanMessage.length > 10000
  ) {
    return res.status(400).send("failed");
  }

  // Safely format customer details
  const safeName = escapeHtml(cleanName);
  const safeEmail = escapeHtml(cleanEmail);
  const safePhone = escapeHtml(cleanPhone);
  const safeMessage = escapeHtml(cleanMessage).replace(
    /\r\n|\r|\n/g,
    "<br>"
  );

  try {
    const { data, error } = await resend.emails.send({
      // Keep this sender while using Resend's testing mode
      from: "Flex & Fuel Website <onboarding@resend.dev>",

      // Testing recipient permitted by your current Resend setup
      to: ["bikesh17stha@gmail.com"],

      // Replies go to the customer who submitted the form
      replyTo: cleanEmail,

      subject: `New Contact Message - ${cleanName}`,

      // Plain-text email fallback
      text: [
        "NEW CONTACT MESSAGE — FLEX & FUEL",
        "",
        `Name: ${cleanName}`,
        `Email: ${cleanEmail}`,
        `Phone: ${cleanPhone}`,
        "",
        "CUSTOMER MESSAGE",
        cleanMessage
      ].join("\n"),

      // Styled HTML email
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Message - Flex &amp; Fuel</title>
</head>

<body style="margin:0;padding:0;background-color:#F7F4EC;font-family:Arial,Helvetica,sans-serif;color:#173B3A;">

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
    style="width:100%;background-color:#F7F4EC;padding:32px 12px;">

    <tr>
      <td align="center">

        <table role="presentation" width="600" cellspacing="0" cellpadding="0"
          style="width:100%;max-width:600px;background-color:#ffffff;border-radius:14px;overflow:hidden;">

          <!-- BRAND HEADER -->
          <tr>
            <td align="center"
              style="background-color:#173B3A;padding:34px 24px;">


              <p style="margin:0 0 10px;color:#F28C28;font-size:11px;letter-spacing:4px;text-transform:uppercase;">
                FLEX &amp; FUEL
              </p>

              <h1 style="margin:0;color:#ffffff;font-size:27px;font-weight:600;line-height:1.4;">
                New Contact Message
              </h1>

              <p style="margin:12px 0 0;color:#E4EDEA;font-size:14px;line-height:1.7;">
                A new enquiry has arrived from your website.
              </p>

              <!-- Orange accent line -->
              <table role="presentation" width="55" cellspacing="0" cellpadding="0"
                style="width:55px;margin:22px auto 0;">
                <tr>
                  <td height="3" style="height:3px;background-color:#F28C28;font-size:0;line-height:0;">
                    &nbsp;
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- INTRODUCTION -->
          <tr>
            <td style="padding:30px 28px 12px;">

              <p style="margin:0;color:#173B3A;font-size:15px;line-height:1.8;">
                Hello Flex &amp; Fuel team,
              </p>

              <p style="margin:8px 0 0;color:#64716B;font-size:14px;line-height:1.8;">
                Someone has contacted you through your website. Their details
                and message are included below.
              </p>

            </td>
          </tr>

          <!-- CUSTOMER DETAILS -->
          <tr>
            <td style="padding:16px 28px 0;">

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                style="width:100%;background-color:#FBF9F3;border:1px solid #E9E5D9;border-radius:10px;">

                <tr>
                  <td colspan="2"
                    style="padding:18px;border-bottom:1px solid #E9E5D9;">

                    <h2 style="margin:0;color:#173B3A;font-size:16px;font-weight:600;">
                      Customer Details
                    </h2>

                  </td>
                </tr>

                <tr>
                  <td width="90"
                    style="padding:16px 10px 8px 18px;color:#7B857F;font-size:11px;letter-spacing:1px;text-transform:uppercase;">
                    Name
                  </td>

                  <td
                    style="padding:16px 18px 8px 8px;color:#173B3A;font-size:14px;font-weight:600;overflow-wrap:anywhere;">
                    ${safeName}
                  </td>
                </tr>

                <tr>
                  <td
                    style="padding:12px 10px 8px 18px;color:#7B857F;font-size:11px;letter-spacing:1px;text-transform:uppercase;">
                    Email
                  </td>

                  <td
                    style="padding:12px 18px 8px 8px;font-size:14px;overflow-wrap:anywhere;">
                    <a href="mailto:${safeEmail}"
                      style="color:#D96D12;text-decoration:none;">
                      ${safeEmail}
                    </a>
                  </td>
                </tr>

                <tr>
                  <td
                    style="padding:12px 10px 18px 18px;color:#7B857F;font-size:11px;letter-spacing:1px;text-transform:uppercase;">
                    Phone
                  </td>

                  <td
                    style="padding:12px 18px 18px 8px;color:#173B3A;font-size:14px;overflow-wrap:anywhere;">
                    ${safePhone}
                  </td>
                </tr>

              </table>

            </td>
          </tr>

          <!-- CUSTOMER MESSAGE -->
          <tr>
            <td style="padding:28px 28px 0;">

              <h2 style="margin:0 0 14px;color:#173B3A;font-size:16px;font-weight:600;">
                Customer Message
              </h2>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                style="width:100%;background-color:#FBF9F3;border:1px solid #E9E5D9;border-left:4px solid #F28C28;border-radius:6px;">

                <tr>
                  <td style="padding:20px;color:#46564F;font-size:14px;line-height:1.9;overflow-wrap:anywhere;">
                    ${safeMessage}
                  </td>
                </tr>

              </table>

            </td>
          </tr>

          <!-- REPLY BUTTON -->
          <tr>
            <td style="padding:28px 28px 32px;">

              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" bgcolor="#173B3A" style="border-radius:6px;">
                    <a
                      href="mailto:${safeEmail}"
                      style="display:inline-block;padding:14px 24px;background-color:#173B3A;color:#ffffff;font-size:13px;font-weight:600;letter-spacing:0.3px;text-decoration:none;border-radius:6px;"
                    >
                      Reply to Customer
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:18px 0 0;color:#7B857F;font-size:12px;line-height:1.7;">
                Simply click the button above to reply directly to the customer.
              </p>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center"
              style="background-color:#FBF9F3;border-top:1px solid #E9E5D9;padding:24px 20px;">

              <p style="margin:0 0 8px;color:#173B3A;font-size:15px;font-weight:600;">
                FLEX &amp; FUEL
              </p>

              <p style="margin:0 0 12px;color:#D96D12;font-size:12px;letter-spacing:1px;">
                ENJOY THE SIP
              </p>

              <p style="margin:0;color:#7B857F;font-size:11px;line-height:1.8;">
                New enquiry received from your website contact form.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
      `
    });

    if (error || !data) {
      console.error("Resend email error:", error);
      return res.status(500).send("failed");
    }

    console.log("Contact email sent:", data.id);
    return res.status(200).send("sent");

  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).send("failed");
  }
};
