const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));

let persons = require('./persons')

const PORT = 3001
const baseURL = `/api/persons`


app.get(baseURL, (request, response) => {

    response.json(persons)
})

app.post(baseURL, (request, response) => {

    let newPerson = request.body

    if (!newPerson.name || !newPerson.number) {
        return response.status(400).json({ error: 'name and number are mandatory' })
    }

    if (persons.findIndex(p => p.name === newPerson.name) !== -1) {
        return response.status(400).json({ error: 'name must be unique' })
    }
    const newPersonId = Math.random() * (100000000 - 1) + 1
    newPerson = { ...newPerson, id: newPersonId }
    persons = persons.concat(newPerson)

    response.json(newPerson)
})

app.get(`${baseURL}/:id`, (request, response) => {

    const id = Number(request.params.id);
    const person = persons.find(p => p.id === id)

    if (!person) {
        return response.status(404).end()
    }
    return response.json(person)
})

app.delete(`${baseURL}/:id`, (request, response) => {
    console.log('deleting')
    const id = Number(request.params.id);
    persons = persons.filter(p => p.id !== id)

    return response.status(204).end()
})


app.get('/info', (request, response) => {
    console.log('info')
    const timing = new Date().toString();
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
                        <p>${timing}</p>`)
})

app.listen(PORT, () => {
    console.log(`server running on port${PORT}`)
})