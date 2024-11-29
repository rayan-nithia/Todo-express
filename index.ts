import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Définition de l'interface pour une tâche
interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

// Initialisation de l'application et des données
const app = express();
const port = 3000;
const password = 'securepassword';  // Le mot de passe à vérifier
const todos: Todo[] = [
  { id: uuidv4(), title: "My todo", completed: true },
  { id: uuidv4(), title: "My todo 2", completed: false }
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour vérifier le mot de passe
const checkPassword = (req: Request, res: Response, next: Function) => {
  const { password: userPassword } = req.body;

  if (userPassword === password) {
    next(); // Le mot de passe est correct, on passe à la suite
  } else {
    res.status(403).send('Mot de passe incorrect');
  }
};

// Afficher la liste des tâches au format JSON
app.get("/todos", checkPassword, (req: Request, res: Response) => {
  res.json(todos);
});

// Obtenir une tâche par son ID
app.get("/todos/:id", checkPassword, (req: Request, res: Response) => {
  const id = req.params.id;
  const todo = todos.filter((todo) => todo.id === id);
  if (todo.length > 0) {
    res.json(todo);
  } else {
    res.status(404).send("Tâche non trouvée");
  }
});

// Ajouter une tâche dans la liste
app.post("/todos", checkPassword, (req: Request, res: Response) => {
  const body = req.body;
  const newTodo: Todo = { id: uuidv4(), ...body };
  todos.push(newTodo);
  res.json(todos);
});

// Modifier une tâche en ciblant l'ID
app.put("/todos/:id", checkPassword, (req: Request, res: Response) => {
  const todo = todos.find((todo) => todo.id === req.params.id);
  if (todo) {
    todo.title = req.body.title;
    todo.completed = req.body.completed;
    res.json(todos);
  } else {
    res.status(404).send("La tâche n'existe pas");
  }
});

// Supprimer une tâche
app.delete("/todos/:id", checkPassword, (req: Request, res: Response) => {
  const index = todos.findIndex((todo) => todo.id === req.params.id);
  if (index !== -1) {
    todos.splice(index, 1);
    res.json(todos);
  } else {
    res.status(404).send("La tâche n'existe pas");
  }
});

app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});