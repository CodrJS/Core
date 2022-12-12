import GenericTemplate from "./Generic.js";

type RequiredParamsType = "name" | "link";
export default class WelcomeTemplate extends GenericTemplate<RequiredParamsType> {
  /**
   *
   * @param {string} template Email Template
   * @param {Object} options Required parameters for template
   */
  constructor() {
    const subject = "Welcome To TrustedRentr!";
    const temp = `Welcome to Codr, {name}!

Your Codr administator has added you to their organization. 
You can sign into your account using your email at {link}.

Feel free to reach out to us with questions!`.replace(/\n/g, `<br />`);
    const opts: RequiredParamsType[] = ["name", "link"];
    super(temp, subject, opts);
  }
}
