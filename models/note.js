const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minlength: 5,
    required: true
  },
  date: {
    required: true,
    type: Date
  },
  important: Boolean
})

//Convert ID object of mongoose to a string.
//Mongoose inbuilt transform method converts objects to string, or string to objects
//Delete id and v for passing easier looking UI to front-end

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)