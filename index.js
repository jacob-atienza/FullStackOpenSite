const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

app.get('/api/people', (request, response) => {
  Person.find({})
    .then(people => {
      response.json(people)
    })
    .catch(error => {
      response.status(500).json({ error: 'Failed to fetch people' })
    })
})

app.post('/api/people', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'Content Missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => {
      response.status(500).json({ error: 'Failed to save person' })
    })
})

app.get('/api/people/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).json({ error: 'Person not found' })
      }
    })
    .catch(error => {
      response.status(500).json({ error: 'Failed to fetch person' })
    })
})

app.delete('/api/people/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(500).json({ error: 'Failed to delete person' })
    })
})

const PORT = process.env.PORT || 3001 // Default to 3001 if PORT not set
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
