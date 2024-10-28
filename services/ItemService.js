const Item = require('../models/Item');

class ItemService {
    static async storeItems(itemNames, connection) {
        const storedItemIds = [];

        for (const name of itemNames) {
            console.log(name);
            
            const existingItem = await Item.findByName(name, connection);
            if (existingItem) {
                storedItemIds.push(existingItem.id);
            } else {
                const itemId = await Item.storeItems(name, connection);
                storedItemIds.push(itemId);
            }
        }

        return storedItemIds;
    }
}

module.exports = ItemService;
