export interface IResponse<Details> {
  message: string;
  details?: Details;
}

export default class Response<Details = undefined> {
  message: IResponse<Details>["message"];
  details: Details;

  constructor({ message, details }: IResponse<Details>) {
    this.message = message;
    this.details = details as Details;
  }

  toJSON() {
    return {
      message: this.message,
      details: this.details,
    };
  }
}
