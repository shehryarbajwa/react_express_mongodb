const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
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

beforeEach(async () => {
  await Note.deleteMany({});

  let noteObject = new Note(initialNotes[0]);
  await noteObject.save();

  noteObject = new Note(initialNotes[1]);
  await noteObject.save();
});

test("notes are returned as json", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are four notes", async () => {
  const response = await api.get("/api/notes");
  expect(response.body.length).toBe(2);
});

test("the first note is about HTTP methods", async () => {
  const response = await api.get("/api/notes");
  expect(response.body[0].content).toBe("HTML is easy");
});

test("all notes are returned", async () => {
  const response = await api.get("/api/notes");
  expect(response.body.length).toBe(initialNotes.length);
});

test("a specific note is within the returned notes", async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(r => r.content)
  
    expect(contents).toContain('Browser can execute only JavaScript')
});

test('a valid note can be added', async () => {
    const newNote = {
        content: 'async/await simplifies making asynchronous calls ',
        important: true
    }

    await api
    .post('/api/notes')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/notes')
    const contents = response.body.map(r => r.content)
    console.log(contents)
    expect(response.body.length).toBe(initialNotes.length + 1)
    expect(contents).toContain('async/await simplifies making asynchronous calls ')
})

afterAll(() => {
  mongoose.connection.close();
});
