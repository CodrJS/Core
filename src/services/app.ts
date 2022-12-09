/*
 * This service is a singleton that is passed onto all other services granting
 * it access to necessary configuration to access the database, authenticating
 * with the server, and other uses.
 */

import { accessibleRecordsPlugin } from "@casl/mongoose";
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
  database?: Mongoose;
  instance: AppOptions["instance"];

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

  private async connect() {
    try {
      this.database = await mongoose.connect(this.databaseUri);
      this.database.plugin(accessibleRecordsPlugin);
    } catch (e) {
      //
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
