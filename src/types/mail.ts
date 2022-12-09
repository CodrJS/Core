/**
 * Email options
 * @typedef {RecipientEmailOptions & OtherEmailOptions} EmailOptions
 */
export type EmailOptions = RecipientEmailOptions & OtherEmailOptions;

/**
 * Recipient email options
 * @typedef {Object} RecipientEmailOptions
 * @property {string} to Recipient
 * @property {string[]} [cc] An array of CC emails
 * @property {string[]} [bcc] An array of BCC emails
 */
export interface RecipientEmailOptions {
  to: string;
  cc?: string[];
  bcc?: string[];
}

/**
 * Other email options
 * @typedef {Object} OtherEmailOptions
 * @property {string} from Sender
 * @property {string} subject Email subject
 */
export interface OtherEmailOptions {
  from: string;
  subject: string;
}
