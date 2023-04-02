const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

console.log('process.argv: ', process.argv)

const password = process.argv[2]

const url =
    `mongodb+srv://fullstackopen:${password}@cluster0fullstackopen.lxizek2.mongodb.net/phoneBook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(result => {
        console.log('person saved!')
        console.log(`added: ${result.name}, number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('phonebook: ')
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
}
