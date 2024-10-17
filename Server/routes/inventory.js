// Update or add item to inventory based on item name or ID
app.post('/api/inventory/update', async (req, res) => {
    const { itemDetails } = req.body;

    try {
        for (const item of itemDetails) {
            const existingItem = await Inventory.findOne({ name: item.account });
            if (existingItem) {
                // If item exists, increase quantity
                existingItem.quantity += item.quantity;
                await existingItem.save();
            } else {
                // If item doesn't exist, add to inventory
                const newItem = new Inventory({
                    name: item.account,
                    quantity: item.quantity,
                    rate: item.rate,
                });
                await newItem.save();
            }
        }
        res.status(200).send('Inventory updated');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating inventory');
    }
});
