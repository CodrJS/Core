export interface IResponse<Details> {
  message: string;
  details?: Details;
}

export default class Response<Details = undefined> {
  message: IResponse<Details>["message"];
  details: IResponse<Details>["details"];

  constructor({ message, details = undefined }: IResponse<Details>) {
    this.message = message;
    this.details = details;
  }

  toJSON() {
    return {
      message: this.message,
      details: this.details,
    };
  }
}
