import GenericTemplate from "../Generic.js";

type RequiredParamsType = "role" | "link";
export default class AnonymousWelcomeTemplate extends GenericTemplate<RequiredParamsType> {
  /**
   *
   * @param {string} template Email Template
   * @param {Object} options Required parameters for template
   */
  constructor() {
    const subject = "Welcome To Codr!";
    const temp = `Welcome to Codr!

You have been invited to join as a(n) {role}. 
You can now sign into your account using your email at {link}.

Feel free to reach out with questions!`.replace(/\n/g, `<br />`);
    const opts: RequiredParamsType[] = ["role", "link"];
    super(temp, subject, opts);
  }
}
