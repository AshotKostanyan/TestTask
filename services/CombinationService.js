const Combination = require('../models/Combination');

class CombinationService {
    static async storeCombination(combinationArray, connection) {
        return await Combination.storeCombination(combinationArray, connection);
    }
}

module.exports = CombinationService;
