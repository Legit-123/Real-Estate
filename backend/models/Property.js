const FileDB = require('../config/fileDB');

class Property {
  constructor(data) {
    Object.assign(this, data);
  }

  static async find() {
    return FileDB.getProperties();
  }

  static async findById(id) {
    return FileDB.getPropertyById(id);
  }

  static async findByIdAndUpdate(id, data, options = {}) {
    return FileDB.updateProperty(id, data);
  }

  static async findByIdAndDelete(id) {
    return FileDB.deleteProperty(id);
  }

  static async countDocuments() {
    return FileDB.getProperties().length;
  }

  async save() {
    if (this._id) {
      return FileDB.updateProperty(this._id, this);
    } else {
      const saved = FileDB.createProperty(this);
      this._id = saved._id;
      return saved;
    }
  }

  async increaseViewCount() {
    const updated = FileDB.incrementViewCount(this._id);
    Object.assign(this, updated);
    return this;
  }
}

module.exports = Property;