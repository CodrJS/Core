/**
 * @TODO
 *
 * 1. establish AWS SES connection
 * 2. create generic send email function that accepts a template and parameters
 *    a. email template model
 *    b. create an ENUM of privacy settings to attach to the templates
 * 3. test email function
 * 4. create privacy settings in profile page
 * 5. create function to determine if a email can be sent
 * 6. create function to handle email bounces
 *    a. add a flag on a user's profile to state invalid email address
 *    b. create a notification on the site to inform the user to change email
 * 7. create function to generate mailing lists from
 */

/**
 * PRIVACY TOGGLES
 *
 * 1. Notifications
 *    a. Security notifications (password changed, email change, etc... make this required?? I'll check if this is possible with my connections)
 *    b. Other (general system notifications; user feedback, welcome message, etc.)
 */

import send from "./send.js";

const Mail = { send };

export default Mail;
