/**
 * Handles sending out the email
 */
// import fs from "fs";
// import path from "path";
import client from "./client";
import verify from "./verify";
import { EmailOptions } from "../../types/mail";

/**
 *
 * @param {string} body
 * @param {EmailOptions} options
 */
const send = function send(body: string, options: EmailOptions) {
  const test = verify<EmailOptions>(options, ["to", "from", "subject"]);
  if (test.passed) {
    return client.sendMail({
      from: options.from,
      replyTo: options.from,
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      subject: options.subject,
      html: body,
      // attachments: [
      //   {
      //     cid: "logo",
      //     filename: "logo.png",
      //     content: fs.createReadStream(
      //       path.join(process.cwd(), "public/images/Logo-h100.png"),
      //     ),
      //   },
      // ],
    });
  } else {
    return Promise.reject(
      new Error(
        `Options is missing the following required parameters: ${test.missing.join(
          ", ",
        )}`,
      ),
    );
  }
};

export default send;
