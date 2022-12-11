/*
 * This service is a singleton that is passed onto all other services granting
 * it access to necessary configuration to access the database, authenticating
 * with the server, and other uses.
 */

import { accessibleRecordsPlugin } from "@casl/mongoose";
import User from "../models/User";
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

    this.connect();
  }

  get mongoIsConnected() {
    return this.mongo?.connection.readyState === 1
  }

  private async connect() {
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
          console.log("An admin email could not be found.");
        }
      } catch (e) {
        console.error("Could not create an admin user.");
        console.error(e);
      }
    } catch (e) {
      console.error("Cannot connect to MongoDB server.");
      console.error(e);
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
