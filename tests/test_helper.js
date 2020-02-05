const Note = require('../models/note.js')
const User = require('../models/users')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false
  },
  {
    content: 'Browser can execute only Javascript',
    important: true
  }
]

const initialUsers = [
  {
    username: 'Test a/c 1',
    name: 'Test1',
    password: 'password'
  },
  {
    username: 'Test a/c 2',
    name: 'Test2',
    password: 'password'
  }
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.remove()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialNotes,
  initialUsers,
  nonExistingId,
  notesInDb,
  usersInDb,
}