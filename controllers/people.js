const peopleRouter = require('express').Router()
const Person = require('../models/person')

peopleRouter.get('/', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

peopleRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(Person => {
      if (Person) {
        response.json(Person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

peopleRouter.post('/', (request, response, next) => {
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

peopleRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

peopleRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const Person = {
    content: body.name,
    important: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, Person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

module.exports = peopleRouter
