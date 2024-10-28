const mysql = require('mysql2/promise');

class ResponseService {
  static async storeResponse(responseData, connection) {
    try {
      const [result] = await connection.execute(
        'INSERT INTO responses (response) VALUES (?)',
        [JSON.stringify(responseData)]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error storing response:', error);
      throw error;
    }
  }
}

module.exports = ResponseService;
