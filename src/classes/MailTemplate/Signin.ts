import GenericTemplate from "./Generic.js";

type RequiredParamsType = "link";
export default class SigninTemplate extends GenericTemplate<RequiredParamsType> {
  /**
   *
   * @param {string} template Email Template
   * @param {Object} options Required parameters for template
   */
  constructor() {
    const subject = "Sign into Codr";
    const requiredParams: RequiredParamsType[] = ["link"];
    const template = `Hello,

Sign into your Codr account with the following link:
{link}

If you did not attempt to sign in, disregard this email.`.replace(
      /\n/g,
      `<br />`,
    );

    super(template, subject, requiredParams);
  }
}
