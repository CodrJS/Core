/*
 * This service is a singleton that is passed onto all other services granting
 * it access to necessary configuration to access the database, authenticating
 * with the server, and other uses.
 */

interface AppOptions {
  /** database url to mongodb instance */
  database: string;
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
  database: AppOptions["database"];
  instance: AppOptions["instance"];

  constructor(options: AppOptions) {
    if (options?.database) {
      if (testMongoUrl(options.database)) this.database = options.database;
      else throw new Error("Malformatted Mongodb url.");
    } else {
      throw new Error("No Mongodb url was given.");
    }

    if (options?.instance) {
      this.instance = options.instance;
    } else {
      throw new Error("No instance data was given.");
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
