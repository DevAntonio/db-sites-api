const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const dbFilePath = path.join(__dirname, 'db_infos.json');

function readDb() {
    try {
        const data = fs.readFileSync(dbFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function saveDb(data) {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// Rota para servir o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para listar produtos
app.get('/api/products', (req, res) => {
    const db = readDb();
    res.json(db);
});

// Rota para adicionar produtos (não usada no index.html, mas mantida para compatibilidade)
app.post('/api/products', (req, res) => {
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }

    const db = readDb();
    db.push({ name, description, price: parseFloat(price) });
    saveDb(db);

    res.status(201).json({ message: 'Produto adicionado com sucesso!' });
});

app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});