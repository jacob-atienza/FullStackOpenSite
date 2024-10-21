const express = require('express')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

const app = express()
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

app.get('/api/people', (request, response) => {
  Person.find({})
    .then(people => {
      response.json(people)
    })
    .catch(() => {
      response.status(500).json({ error: 'Failed to fetch people' })
    })
})

app.post('/api/people', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error)) // Pass any errors to the error handler
})

app.get('/api/people/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).json({ error: 'Person not found' })
      }
    })
    .catch(error => next(error))
})

app.delete('/api/people/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(deletedPerson => {
      if (deletedPerson) {
        response.json(deletedPerson)
      } else {
        response.status(404).json({ error: 'Person not found' })
      }
    })
    .catch(() => {
      response.status(500).json({ error: 'Failed to delete person' })
    })
})

// Define the unknownEndpoint middleware function
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001 // Default to 3001 if PORT not set
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
