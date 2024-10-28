const Response = require('../models/Response');

class ResponseService {
    static async storeResponse(responseData, connection) {
        return await Response.storeResponse(responseData, connection);
    }
}

module.exports = ResponseService;
