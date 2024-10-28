const mysql = require('mysql2/promise');

class CombinationService {
  static async storeCombination(combinationArray, connection) {
    try {
      const [result] = await connection.execute(
        'INSERT INTO combinations (combination) VALUES (?)',
        [JSON.stringify(combinationArray)]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error storing combination:', error);
      throw error;
    }
  }
}

module.exports = CombinationService;
