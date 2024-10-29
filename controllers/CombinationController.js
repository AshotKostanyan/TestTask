const mysql = require('mysql2/promise');
const { dbConfig } = require('../config/dbConfig');
const ItemService = require('../services/ItemService');
const CombinationService = require('../services/CombinationService');
const ResponseService = require('../services/ResponseService');

class CombinationsController {
    static async getCombinations(req, res) {
        const { array, length } = req.body;


        // After obtaining the array and the combination length, I created combinations using the array indexes with the specified length.
        // Then, using those index combinations, I generated item combinations by utilizing all items corresponding to each index.
        // Using this algorithm, I ensured that elements of the same type do not repeat in the combinations.
        
        const elements = CombinationsController.transformArray(array);
        const indexCombinations = CombinationsController.generateIndexCombinations(array.length, length);
        const result = CombinationsController.getAllCombinations(elements, indexCombinations).reduce((acc, curr) => acc.concat(curr), []);
        const labels = elements.reduce((acc, curr) => acc.concat(curr), []);
        // I call reduce function for array formating

        
        const connection = await mysql.createConnection(dbConfig);

        try {
            await connection.beginTransaction();
            
            await ItemService.storeItems(labels, connection);
            const combinationId = await CombinationService.storeCombination(result, connection);
            const response = {
                id: combinationId,
                combination: result
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

    static generateIndexCombinations(maxNumber, length) {
        const array = Array.from({ length: maxNumber }, (_, i) => i);
        const results = [];

        const createCombination = (start, combination) => {
            if (combination.length === length) {
                results.push([...combination]);
                return;
            }

            for (let i = start; i < array.length; i++) {
                combination.push(array[i]);
                createCombination(i + 1, combination);
                combination.pop();
            }
        };

        createCombination(0, []);
        return results;
    }

    static transformArray(arr) {
        const result = [];
        
        for (let i = 0; i < arr.length; i++) {
            const num = arr[i];
            const letter = String.fromCharCode(65 + i);
            const subArray = [];
            
            for (let i = 1; i <= num; i++) {
              subArray.push(`${letter}${i}`);
            }
            
            result.push(subArray);
        }
        
        return result;
    }

    static getAllCombinations(elements, indexes) {
        const results = [];
      
        for (let comboIndex = 0; comboIndex < indexes.length; comboIndex++) {
          const indexCombo = indexes[comboIndex];
          const combinations = [];
      
          function backtrack(temp, depth) {
            if (depth === indexCombo.length) {
              combinations.push([...temp]);
              return;
            }
      
            const currentArray = elements[indexCombo[depth]];
            if (!currentArray) {
              console.error(`Invalid access at depth ${depth}: Index ${indexCombo[depth]} is undefined.`);
              return;
            }
      
            for (let i = 0; i < currentArray.length; i++) {
              temp.push(currentArray[i]);
              backtrack(temp, depth + 1);
              temp.pop();
            }
          }
      
          backtrack([], 0);
          results.push(combinations);
        }
      
        return results;
    }
}

module.exports = CombinationsController;
