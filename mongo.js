const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://noteapp:${password}@cluster0-3ykrp.mongodb.net/note-app?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true
});

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean
});

const Note = mongoose.model("Note", noteSchema);

const note = new Note({
  content: "Node.js is easy",
  date: new Date(),
  important: true
});

const note1 = new Note({
  content: "MongoDB note taking app",
  date: new Date(),
  important: false
});

// note1.save().then(response => {
//   console.log('note1 saved')
//   mongoose.connection.close()
// })

// note.save().then(response => {
//   console.log('note saved')
//   mongoose.connection.close()
// })

Note.find({ important: true }).then(result => {
  result.forEach(note => {
    console.log(note);
  });
  mongoose.connection.close();
});
