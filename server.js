const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(express.json());
app.use('/', express.static('public'));

// Replace '/budget' with the MongoDB route only
const dbURI = 'mongodb://localhost:27017/personal_budget';

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

// Define the schema and model for budget data
const budgetSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true,
        match: /^#[0-9A-F]{6}$/i // Ensures color is in hexadecimal format
    }
});

const Budget = mongoose.model('Budget', budgetSchema);

// Fetch budget data from MongoDB
app.get('/budget', async (req, res) => {
    try {
        const budgets = await Budget.find();
        res.json(budgets);
    } catch (err) {
        res.status(500).send('Error fetching budget data');
    }
});
mongoose.connect(dbURI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });
// Add new budget entry
app.post('/budget', async (req, res) => {
    const { title, value, color } = req.body;

    // Check if all required fields are present
    if (!title || !value || !color) {
        return res.status(400).send('Title, value, and color are required');
    }

    // Create new budget entry
    const newBudget = new Budget({ title, value, color });

    try {
        await newBudget.save();
        res.status(201).send('Budget entry added successfully');
    } catch (err) {
        res.status(500).send('Error saving budget entry');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
