const FileDB = require('../config/fileDB');

class User {
  constructor(data) {
    Object.assign(this, data);
  }

  static async findOne(query) {
    if (query.email) {
      return FileDB.getUserByEmail(query.email);
    }
    if (query._id) {
      return FileDB.getUserById(query._id);
    }
    return null;
  }

  static async find() {
    return FileDB.getUsers();
  }

  static async findById(id) {
    return FileDB.getUserById(id);
  }

  async save() {
    if (this._id) {
      return FileDB.updateUser(this._id, this);
    } else {
      const saved = FileDB.createUser(this);
      this._id = saved._id;
      return saved;
    }
  }
}

module.exports = User;