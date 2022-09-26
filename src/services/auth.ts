/**
 * This service handles all authentication handlers for codr.
 */

import App from "./app";

class Authentication {
  private app: App;
  constructor(app: App) {
    this.app = app;
  }
}

export default Authentication;
