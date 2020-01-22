require("dotenv").config();
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Note = require("./models/note");
const {errorHandler, unknownEndpoint, requestLogger} = require("./notifications/error_handling.js")

const app = express();
app.use(express.static("build"));
app.use(bodyParser.json());
app.use(cors());
app.use(requestLogger)

//Error Handling


app.get("/api", (request, response) => {
  response.send("<p>Shehryar Bajwa built this</p>");
});

app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id).then(note => {
    if (note){
      response.json(note.toJSON());
    }
    else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
});

app.get("/api/notes", (request, response) => {
  Note.find({})
  .then(notes => {
    if(notes){
      response.json(notes.map(note => note.toJSON()));
    } else{
      response.status(404).end();
    }
  })
  .catch(error => {
    console.log(error);
    response.status(400).send({ error: 'malformatted request' })
  })
});



app.post("/api/notes", (request, response) => {
  //Find the largest id in the notes list and take its maximum
  //Then note.id becomes +1 this

  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({ error: "content missing" });
  }

  //If the value of important exists it will be set to body.important otherwise false

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  });
  
  note.save()
  .then(note => {
    if (note){
      response.json(note.toJSON())
    } else{
      response.status(404).end()
    }
  })
  .catch(error => {
    console.log(error)
    response.status(400).end()
  })
});

app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note)
    .then(updatedNote => {
      response.json(updatedNote.toJSON())
    })
    .catch(error => next(error))
})

app.delete("/api/notes/:id", (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
  .then(result => {
    if(result){
      response.status(204).end();
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
