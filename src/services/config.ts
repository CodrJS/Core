/**
 * This service handles all configuration handlers for codr.
 */

import App from "./app.js";

class Configuration {
  private app: App;
  constructor(app: App) {
    this.app = app;
  }
}

export default Configuration;
