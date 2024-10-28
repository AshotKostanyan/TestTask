const mysql = require('mysql2/promise');
const { dbConfig } = require('../config/dbConfig')

class ItemService {
  static async storeItems(label, connection) {
    try {
      await connection.execute(
        'INSERT INTO items (label) VALUES (?)',
        [label]
      );
    } catch (error) {
      console.error('Error storing items:', error);
      throw error;
    }
  }
  static async findByName(name) {
    const connection = await mysql.createConnection(dbConfig);
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM items WHERE label = ?',
        [name]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding item by name:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }
}

module.exports = ItemService;
