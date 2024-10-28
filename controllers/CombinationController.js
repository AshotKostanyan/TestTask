const mysql = require('mysql2/promise');
const { dbConfig } = require('../config/dbConfig');
const ItemService = require('../services/ItemService');
const CombinationService = require('../services/CombinationService');
const ResponseService = require('../services/ResponseService');

class CombinationsController {
    static async getCombinations(req, res) {
        const { array, length } = req.body;

        const labels = CombinationsController.generateLabels(array);
        const results = CombinationsController.generateCombinations(labels, length);

        const connection = await mysql.createConnection(dbConfig);

        try {
            await connection.beginTransaction();
            console.log(labels);
            
            await ItemService.storeItems(labels, connection);
            const combinationId = await CombinationService.storeCombination(results, connection);
            const response = {
                id: combinationId,
                combination: results
            };

            await ResponseService.storeResponse(response, connection);

            await connection.commit();

            return res.status(200).json(response);
        } catch (error) {
            await connection.rollback();
            console.error('Transaction error:', error);
            return res.status(500).json({ message: 'Something went wrong' });
        } finally {
            await connection.end();
        }
    }

    static generateLabels(array) {
        const labels = [];
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array[i]; j++) {
                labels.push(String.fromCharCode(65 + i) + (j + 1));
            }
        }
        return labels;
    }

    static generateCombinations(labels, length) {
        const results = [];
        const createCombination = (start, combination) => {
            if (combination.length === length) {
                if (CombinationsController.isValidCombination(combination)) {
                    results.push([...combination]);
                }
                return;
            }

            for (let i = start; i < labels.length; i++) {
                combination.push(labels[i]);
                createCombination(i + 1, combination);
                combination.pop();
            }
        };

        createCombination(0, []);
        return results;
    }

    static isValidCombination(combination) {
        let lastChar = null;
        for (let i = 0; i < combination.length; i++) {
            const currentChar = combination[i][0];
            if (currentChar === lastChar) {
                return false;
            }
            lastChar = currentChar;
            if (i < combination.length - 1 && combination[i][0] === combination[i + 1][0]) {
                return false;
            }
        }
        return true;
    }
}

module.exports = CombinationsController;
