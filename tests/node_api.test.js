const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const { initialNotes, nonExistingId, notesInDb } = require("./test_helper");
const Note = require("../models/note.js");

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
  const response = await api.get("/api/notes");

  const contents = response.body.map(r => r.content);

  expect(contents).toContain("Browser can execute only JavaScript");
});

test("a valid note can be added", async () => {
  const newNote = {
    content: "async/await simplifies making asynchronous calls ",
    date: new Date(),
    important: true
  };

  await api
    .post("/api/notes")
    .send(newNote)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const notesAtEnd = await notesInDb();
  expect(notesAtEnd.length).toBe(initialNotes.length + 1);

  const contents = notesAtEnd.map(n => n.content);
  expect(contents).toContain(
    "async/await simplifies making asynchronous calls "
  );
});

test("note without content is not added", async () => {
  const newNote = {
    important: true
  };

  await api
    .post("/api/notes")
    .send(newNote)
    .expect(400);

  const notesAtEnd = await notesInDb();
  expect(notesAtEnd.length).toBe(initialNotes.length);
});

test("a specific note can be viewed", async () => {
  const notesAtStart = await notesInDb();
  const noteToView = notesAtStart[0];

  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(resultNote.body).toEqual(noteToView);
});

test('a note can be deleted', async () => {
    const notesAtStart = await notesInDb();
    const noteToDelete = notesAtStart[0]

    await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)

    const notesAtEnd = await notesInDb();
    expect(notesAtEnd.length).toBe(initialNotes.length - 1)

    const content = notesAtEnd.map(r => r.content)
    expect(content).not.toContain(noteToDelete.content)
})

afterAll(() => {
  mongoose.connection.close();
});
