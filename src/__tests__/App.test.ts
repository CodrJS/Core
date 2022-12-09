import dotenv from "dotenv";
import Codr, { App } from "../";

dotenv.config();

describe("App configuration", () => {
  const instance1 = {
    name: "My App Instance",
    contact: {
      name: "Dylan",
      email: "dylan@dylanbulmer.com",
    },
  };
  const instance2 = JSON.parse(JSON.stringify(instance1));
  delete instance2.contact;
  const databaseUri = process.env.MONGODB_URL as string;

  // create app from Codr singleton
  const app1 = new Codr.App({ databaseUri: databaseUri, instance: instance1 });
  // create app from cherry picked import
  const app2 = new App({ databaseUri: databaseUri, instance: instance2 });

  it("does not throw an error", () => {
    expect(app1.databaseUri).toBe(
      "mongodb://someUser:abc123@server-a9.host.com:41653,server-a2.host.com/testdb-2?replicaSet=rs-some2&replicaSet2=rs-some.2",
    );
    expect(app1.instance?.contact?.name).toEqual("Dylan");

    expect(app2.databaseUri).toBe(
      "mongodb://someUser:abc123@server-a9.host.com:41653,server-a2.host.com/testdb-2?replicaSet=rs-some2&replicaSet2=rs-some.2",
    );
    expect(app2.instance?.name).toEqual("My App Instance");
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
      return new App({
        databaseUri: "mongodb:/123.abc.com:27017/test",
        instance: instance1,
      });
    };
    expect(t).toThrow(Error);
    expect(t).toThrow("Malformatted Mongodb url.");
  });

  it("throws instance data missing", () => {
    const t2 = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return new App({ databaseUri: databaseUri });
    };

    expect(t2).toThrow(Error);
    expect(t2).toThrow("No instance data was given.");
  });
});
