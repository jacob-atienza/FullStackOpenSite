const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/info', (request, response) => {
  response.send(`Phonebook has info for ${persons.length} persons <br /> ${new Date} `)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  response.json(person)
})
//another change
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.use(express.json())
app.post('/api/persons', (request, response) => {
  const body = request.body;

  if(!persons.find(person => person.name === request.body.name)) {
    return response.status(400).json({
      error: 'Name already exists'
    })
  }
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name or number missing'
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  response.json(person)
})

const generateId = () => {
  const maxId = persons.length > 0
      ? Math.max(...persons.map(n => Number(n.id)))
      : 0
  return String(maxId + 1)
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
