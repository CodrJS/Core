import Response, { IResponse } from "./Response";

interface IError {
  status: number;
}

export default class Error<Details = undefined> extends Response<Details> {
  status: IError["status"];

  constructor({ status, message }: IError & IResponse<Details>) {
    super({ message });
    this.status = status;
  }

  toJSON() {
    return {
      status: this.status,
      ...super.toJSON(),
    };
  }
}
