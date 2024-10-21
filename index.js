﻿const express = require('express')
const app = express()
require('dotenv').config()
app.use(express.static('dist'))
const Person = require('./models/person')

let people = []

const cors = require('cors')
app.use(cors())
app.use(express.json())

app.get('/api/people', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
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
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.get('/api/people', (request, response) => {
  people.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/people', (request, response) => {
  const id = Number(request.params.id)
  people = people.filter(person => person.id !== id)
  response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
