import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import AccessToken, { decrypt, encrypt } from "../classes/AccessToken";
import Error from "../classes/Error";

dotenv.config();

interface IAccessCode {
  email: string;
  token: typeof uuidv4;
}

describe("Access Token and Access Code generation", () => {
  const uuid1 = uuidv4();
  const uuid2 = uuidv4();
  const uuid3 = uuidv4();
  const uuid4 = uuidv4();

  // normal generation
  const token1 = new AccessToken(uuid1);

  // create token from encoded string
  const preToken2 = new AccessToken(uuid2);
  const token2 = new AccessToken(preToken2.encode());

  // create token from JSON
  const preToken3 = new AccessToken(uuid3);
  const token3 = new AccessToken(preToken3.toJSON());

  // from incoming login autherization
  const token4 = encrypt(
    JSON.stringify({ email: "text@example.com", token: uuid4 }),
  );

  it("generates a token", () => {
    expect(token1.toJSON().uuid).toBe(uuid1);
    expect(token2.toJSON().uuid).toBe(preToken2.toJSON().uuid);
    expect(token2.toJSON().uuid).toBe(uuid2);
    expect(token3.toJSON().uuid).toBe(preToken3.toJSON().uuid);
    expect(token3.toJSON().uuid).toBe(uuid3);
  });

  it("fails to generate a token", () => {
    const test1 = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return new AccessToken();
    };
    const test2 = () => {
      return new AccessToken("");
    };
    const test3 = () => {
      return new AccessToken("random nonsense");
    };
    const test4 = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return new AccessToken(true);
    };

    expect(test1).toThrow(Error);
    expect(test2).toThrow(Error);
    expect(test3).toThrow(Error);
    expect(test4).toThrow(Error);
  });

  it("decrypts a token", () => {
    const decrypted = decrypt<IAccessCode>(token4);
    expect(decrypted.token).toBe(uuid4);
  });
});
