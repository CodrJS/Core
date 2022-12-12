/*
 * This service is a singleton that is passed onto all other services granting
 * it access to necessary configuration to access the database, authenticating
 * with the server, and other uses.
 */

import { accessibleRecordsPlugin } from "@casl/mongoose";
import User from "../models/User.js";
import mongoose, { Mongoose } from "mongoose";

interface AppOptions {
  /** database url to mongodb instance */
  databaseUri: string;
  /** codr instance information */
  instance: {
    name: string;
    contact?: {
      name: string;
      email: string;
    };
  };
}

/**
 * Codr App Instance
 */
class App implements AppOptions {
  databaseUri: AppOptions["databaseUri"];
  instance: AppOptions["instance"];
  private mongo?: Mongoose;

  constructor(options: AppOptions) {
    if (options?.databaseUri) {
      if (testMongoUrl(options.databaseUri))
        this.databaseUri = options.databaseUri;
      else throw new Error("Malformatted Mongodb url.");
    } else {
      throw new Error("No Mongodb url was given.");
    }

    if (options?.instance) {
      this.instance = options.instance;
    } else {
      throw new Error("No instance data was given.");
    }

    // manually connect to database.
    // this.connect();
  }

  get mongoIsConnected() {
    return this.mongo?.connection.readyState === 1;
  }

  /**
   * @description Connect to the MongoDB instance.
   */
  async connect() {
    try {
      // connect to the database.
      this.mongo = await mongoose.connect(this.databaseUri);
      this.mongo.plugin(accessibleRecordsPlugin);

      // try to create an admin user.
      try {
        const email = process.env.ADMIN_EMAIL;
        if (email) {
          const user = await User.findOne({ email });
          if (!user) {
            User.create({ email, isAdmin: true });
          }
        } else {
          throw new Error(
            "An admin email could not be found.\nPlease add the env var: ADMIN_EMAIL",
          );
        }
      } catch (e: any) {
        console.error("Could not create an admin user.");
        throw new Error(e?.message);
      }
    } catch (e) {
      throw new Error(
        "Could not connect to the MongoDB server.",
      );
    }
  }
}

const testMongoUrl = (url: string) => {
  const re = new RegExp(
    /mongodb(\+srv)?:\/\/(?:(?<login>[^:/?#[]@]+)(?::(?<password>[^:/?#[]@]+))?@)?(?<host>[\w.-]+(?::\d+)?(?:,[\w.-]+(?::\d+)?)*)(?:\/(?<dbname>[\w.-]+))?(?:\?(?<query>[\w.-]+=[\w.-]+(?:&[\w.-]+=[\w.-]+)*))?/,
    "gm",
  );

  return re.test(url);
};

export default App;
