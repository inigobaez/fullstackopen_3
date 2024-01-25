require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')
const errorHandler = require('./middlewares/errorHandler')
const unknownEndpoint = require('./middlewares/unknownEndpoint')

const app = express()



app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'))



// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
const baseURL = '/api/persons'

//ROUTES

app.get('/info', (request, response, next) => {
  console.log('info')
  const timing = new Date().toString()
  Contact.find({})
    .then(contacts => {
      response.send(`<p>Phonebook has info for ${contacts.length} people</p>
            <p>${timing}</p>`)
    })
    .catch(error => next(error))

})

app.get(baseURL, (request, response) => {
  console.log('get ')
  Contact.find({}).then(contacts => response.json(contacts))

})

app.get(`${baseURL}/:id`, (request, response, next) => {


  Contact.findById(request.params.id).then(contact => {

    if (!contact) {
      return response.status(404).end()
    }
    response.json(contact)

  }).catch((error) => {
    next(error)
  })

})

app.post(baseURL, (request, response, next) => {


  if (request.body.name === undefined || request.body.number === undefined) {
    return response.status(400).json({ error: 'name and number are mandatory' })
  }
  const contact = new Contact({
    name: request.body.name,
    number: request.body.number
  }
  )
  console.log('number??', contact)
  contact
    .save()
    .then(savedContact => savedContact.toJSON())
    .then(savedAndFormattedContact => response.json(savedAndFormattedContact))
    .catch(error => {
      next(error)
    })

})



app.delete(`${baseURL}/:id`, (request, response, next) => {

  Contact.findByIdAndDelete(request.params.id).then(result => {
    if (result) {
      return response.status(204).end()
    }
    return response.status(404).end()

  }).catch(error => next(error))
})

app.put(`${baseURL}/:id`, (request, response, next) => {
  const contact = {
    name: request.body.name,
    number: request.body.number
  }
  Contact.findByIdAndUpdate(request.params.id, contact, { new: true, runValidators: true })
    .then(updatedContact => response.json(updatedContact))
    .catch(error => next(error))
})




// handler of requests with unknown endpoint
app.use(unknownEndpoint)
// this has to be the last loaded middleware.
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`server running on port${PORT}`)
})