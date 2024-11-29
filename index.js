"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
// Initialisation de l'application et des données
const app = (0, express_1.default)();
const port = 3000;
const password = 'securepassword'; // Le mot de passe à vérifier
const todos = [
    { id: (0, uuid_1.v4)(), title: "My todo", completed: true },
    { id: (0, uuid_1.v4)(), title: "My todo 2", completed: false }
];
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Middleware pour vérifier le mot de passe
const checkPassword = (req, res, next) => {
    const { password: userPassword } = req.body;
    if (userPassword === password) {
        next(); // Le mot de passe est correct, on passe à la suite
    }
    else {
        res.status(403).send('Mot de passe incorrect');
    }
};
// Afficher la liste des tâches au format JSON
app.get("/todos", checkPassword, (req, res) => {
    res.json(todos);
});
// Obtenir une tâche par son ID
app.get("/todos/:id", checkPassword, (req, res) => {
    const id = req.params.id;
    const todo = todos.filter((todo) => todo.id === id);
    if (todo.length > 0) {
        res.json(todo);
    }
    else {
        res.status(404).send("Tâche non trouvée");
    }
});
// Ajouter une tâche dans la liste
app.post("/todos", checkPassword, (req, res) => {
    const body = req.body;
    const newTodo = Object.assign({ id: (0, uuid_1.v4)() }, body);
    todos.push(newTodo);
    res.json(todos);
});
// Modifier une tâche en ciblant l'ID
app.put("/todos/:id", checkPassword, (req, res) => {
    const todo = todos.find((todo) => todo.id === req.params.id);
    if (todo) {
        todo.title = req.body.title;
        todo.completed = req.body.completed;
        res.json(todos);
    }
    else {
        res.status(404).send("La tâche n'existe pas");
    }
});
// Supprimer une tâche
app.delete("/todos/:id", checkPassword, (req, res) => {
    const index = todos.findIndex((todo) => todo.id === req.params.id);
    if (index !== -1) {
        todos.splice(index, 1);
        res.json(todos);
    }
    else {
        res.status(404).send("La tâche n'existe pas");
    }
});
app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});
