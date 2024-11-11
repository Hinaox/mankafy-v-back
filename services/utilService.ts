import db from "../models/db.js";

class UtilService {
  public createDefaultActivityTypes() {
    console.log("create default activity types");
    const bdd = db;
  }
}

export default new UtilService();
