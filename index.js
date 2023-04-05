// Node server
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

morgan.token('data', function (req, res) { return JSON.stringify(req.body) })

const app = express()

app.use(express.json())
//app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())
app.use(express.static('build'))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    const personsCount = persons.length
    const currentTime = new Date()
    response.send(
        `<div>
            <p>Phonebook has info for ${personsCount} people</p>
            <p>${currentTime}</p>
        </div>`
    )
})

app.get('/api/persons', (request, response) => {
    // response.json(persons)
    Person.find({}).then(result => {
        response.json(result)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    // const id = Number(request.params.id)
    // const person = persons.find(p => p.id === id)

    // if (person) {
    //     response.json(person)
    // } else {
    //     response.status(404).end()
    // }
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    // const id = Number(request.params.id)
    // persons = persons.filter(p => p.id !== id)

    // response.status(204).end()

    console.log('ID: ', request.params.id)
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})


const isDuplicated = (data) => {
    const duplicatedPersons = persons.filter(p => p.name === data.name)
    if (duplicatedPersons.length !== 0) return true
    return false
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }
    // else if (isDuplicated(body)) {
    //     return response.status(400).json({
    //         error: 'duplicated name'
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 1000000)
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })

    // persons = persons.concat(person)
    // response.json(person)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})