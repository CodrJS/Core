import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { App, Authentication } from "../";
import { encrypt } from "../classes/AccessToken";

dotenv.config();

describe("Authentication Service", () => {
  const app = new App({
    databaseUri:
      "mongodb://someUser:abc123@server-a9.host.com:1234,server-a2.host.com/testdb-2?replicaSet=rs-some2&replicaSet2=rs-some.2",
    instance: {
      name: "My App Instance",
      contact: {
        name: "Dylan",
        email: "dylan@dylanbulmer.com",
      },
    },
  });
  const auth = new Authentication(app);

  it("does not have an email", async () => {
    const token = encrypt(JSON.stringify({ token: uuidv4() }));

    await expect(auth.signinWithEmail(token)).rejects.toEqual({
      details: undefined,
      message: "No email address was received",
      status: 400,
    });
  });
});
