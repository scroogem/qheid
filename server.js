const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const db = new sqlite3.Database("./cards.db");

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS cards (id INTEGER PRIMARY KEY, word TEXT, translation TEXT)");
});

// Добавить карточку
app.post("/add", (req, res) => {
    const { word, translation } = req.body;
    db.run("INSERT INTO cards (word, translation) VALUES (?, ?)", [word, translation], (err) => {
        if (err) return res.status(500).json({ message: "Ошибка добавления" });
        res.json({ message: "Карточка добавлена!" });
    });
});

// Получить случайную карточку
app.get("/random", (req, res) => {
    db.get("SELECT * FROM cards ORDER BY RANDOM() LIMIT 1", (err, row) => {
        if (err || !row) return res.status(404).json({ message: "Нет карточек" });
        res.json(row);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
