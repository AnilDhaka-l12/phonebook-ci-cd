const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

let persons = [
  { id: 1, name: 'Arto Hellas', number: '040-123456' },
  { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
  { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(p => p.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(p => p.id !== id);
  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' });
  }
  const existingPerson = persons.find(p => p.name === body.name);
  if (existingPerson) {
    return res.status(400).json({ error: 'name must be unique' });
  }
  const person = {
    id: Math.floor(Math.random() * 1000000),
    name: body.name,
    number: body.number
  };
  persons = persons.concat(person);
  res.json(person);
});

app.get('/info', (req, res) => {
  const count = persons.length;
  const date = new Date();
  res.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`);
});

// Health check for CI/CD
app.get('/health', (req, res) => {
  res.status(200).send('ok');
});

// Version endpoint
app.get('/version', (req, res) => {
  res.status(200).send('1.0.0');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});