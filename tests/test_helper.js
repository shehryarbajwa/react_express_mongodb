const Note = require("../models/note.js");

const initialNotes = [
  {
    content: "HTML is easy",
    date: new Date(),
    important: false
  },
  {
    content: "Browser can execute only JavaScript",
    date: new Date(),
    important: true
  }
];

const nonExistingId = async () => {
  const note = new Note({ content: "will remove this soon" });
};

const notesInDb = async () => {
  const notes = await Note.find({});
  return notes.map(note => note.toJSON());
};

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb
};
