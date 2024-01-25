const mongoose = require('mongoose')


if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}
//MONGO
const user = 'ibg'
const password = process.argv[2]
const url = `mongodb+srv://${user}:${password}@cluster0.1o3fobh.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)

//SCHEMA
const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Contact = mongoose.model('Contact', contactSchema)



if (process.argv.length === 3) {
    mongoose.connect(url)
    Contact.find({}).then(result => {
        result.forEach(contact => {
            console.log(contact)
        })
        mongoose.connection.close()
    })
}
if (process.argv.length === 5) {

    mongoose.connect(url)
    const name = process.argv[3]
    const number = process.argv[4]
    const contact = new Contact({
        name: name,
        number: number,
    })

    contact.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}




