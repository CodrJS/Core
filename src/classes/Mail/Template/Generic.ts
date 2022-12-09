export interface RecipientEmailOptions {
  to: string;
  cc?: string[] | undefined;
  bcc?: string[] | undefined;
}

export interface IGenericTemplate<T> {
  template: string;
  subject: string;
  requiredParams: T[];
  bcc?: string[];
}

export default class GenericTemplate<T extends string>
  implements IGenericTemplate<T>
{
  readonly template: string;
  readonly subject: string;
  readonly requiredParams: T[];
  bcc?: string[];

  /**
   *
   * @param {string} template Email Template
   * @param {string} subject Email Subject
   * @param {T[]} requiredParams Required parameters for template
   */
  constructor(template: string, subject: string, requiredParams: T[]) {
    this.template = template;
    this.subject = subject;
    this.requiredParams = requiredParams;
  }

  get config() {
    return {
      subject: this.subject,
      from: process.env["EMAIL_FROM"] as string,
      bcc: this.bcc,
    };
  }

  /**
   * @param {{[x: string]: string}} params Values to replace placeholders in template text.
   */
  validate(params: Record<T, string>) {
    const missing = [];
    for (const opt of this.requiredParams) {
      if (Object.prototype.hasOwnProperty.call(params, opt)) {
        // check to makesure the option is not empty
        if (params[opt] === "") {
          missing.push(opt);
        }
      } else {
        // if the option is complete missing, add it to the list
        missing.push(opt);
      }
    }

    if (missing.length) {
      throw new Error(`Missing template parameters: ${missing.join(", ")}`);
    } else {
      return true;
    }
  }

  html(options: Record<T, string>) {
    return new Promise<string>((resolve, reject) => {
      try {
        this.validate(options);
        const content = this.template.replace(
          /{(\w*)}/g,
          function replacer(m, key: T) {
            if (Object.prototype.hasOwnProperty.call(options, key)) {
              return options[key];
            } else {
              throw new Error(`Missing parameter: ${key}`);
            }
          },
        );
        resolve(this.wrapperHTML({ content }));
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Wrapper HTML
   * @param {Object} Options
   * @param {string} Options.content
   * @returns
   */
  private wrapperHTML({ content }: { content: string }) {
    return `<body
  style="background: #f3f4f6; padding: 2em; font-size:16px; font-family:source-sans-pro, Roboto, sans-serif;"
>
  <div style=" text-align: center;">
    <div
      style="background: white; padding: 2em; border-radius: 0.5em; max-width: 500px; text-align: left; margin: auto;"
    >
      ${content}
      <br />
      Best,<br />
      Your Codr Team<br />
      support@codrjs.com<br />
    </div>
  </div>
</body>`.replace(/[\n]*/g, "");
  }
}

/**
 * Email header image code
 *
 * <img
 *   src="cid:logo"
 *   alt="TrustedRentr Logo"
 *   style="display: block; width: 100%; height: 48px; margin-bottom: 2em; object-fit: contain;"
 * />
 */
