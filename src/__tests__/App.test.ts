import dotenv from "dotenv";
import Codr, { App } from "../";

dotenv.config();

describe("App configuration", () => {
  const app1 = new Codr.App({
    database: process.env.MONGODB_URL as string,
  });
  const app2 = new App({
    database: process.env.MONGODB_URL as string,
  });

  it("does not throw an error", () => {
    expect(app1.database).toBe(
      "mongodb://someUser:abc123@server-a9.host.com:41653,server-a2.host.com/testdb-2?replicaSet=rs-some2&replicaSet2=rs-some.2&replicaSet2=rs-some.2",
    );

    expect(app2.database).toBe(
      "mongodb://someUser:abc123@server-a9.host.com:41653,server-a2.host.com/testdb-2?replicaSet=rs-some2&replicaSet2=rs-some.2&replicaSet2=rs-some.2",
    );
  });

  it("throws no mongodb url given", () => {
    const t = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return new App({});
    };
    expect(t).toThrow(Error);
    expect(t).toThrow("No Mongodb url was given.");
  });

  it("throws mongodb url invalid", () => {
    const t = () => {
      return new App({ database: "mongodb:/123.abc.com:27017/test" });
    };
    expect(t).toThrow(Error);
    expect(t).toThrow("Malformatted Mongodb url.");
  });
});
