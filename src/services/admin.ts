/**
 * This service handles all administrative tasks for codr.
 */

import App from "./app.js";

class Administration {
  private app: App;
  constructor(app: App) {
    this.app = app;
  }
}

export default Administration;
