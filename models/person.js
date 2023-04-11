// MongoDB
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB: ', result)
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, 'Name required']
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        // Remove all characters other than '-' and count
        const dashCounter = v.replace(/[^-]/g, '').length
        if (v.length >= 8 && dashCounter === 1) {
          const firstPart = v.split('-')[0]
          if (firstPart.length === 2 || firstPart.length === 3) {
            return true
          }
        }
        return false
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'Phone number required']
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)

