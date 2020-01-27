const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const { initialNotes, nonExistingId, notesInDb } = require("./test_helper");
const Note = require("../models/note.js");
const User = require("../models/user.js");

beforeEach(async () => {
  await Note.deleteMany({});

  let noteObject = new Note(initialNotes[0]);
  await noteObject.save();

  noteObject = new Note(initialNotes[1]);
  await noteObject.save();
});

describe("when there is initially some notes saved", () => {
  test("notes are returned as json", async () => {
    await api
      .get("/api/notes")
      .expect(200)
      .expect("Content-Type", /application\/json/);
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

  describe("viewing a specific note", () => {
    test("succeeds with a valid id", async () => {
      const notesAtStart = await notesInDb();

      const noteToView = notesAtStart[0];

      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(resultNote.body).toEqual(noteToView);
    });

    test("fails with statuscode 400 if note does not exist", async () => {
      const validNonexistingId = await nonExistingId();

      console.log(validNonexistingId);

      await api.get(`/api/notes/${validNonexistingId}`).expect(400);
    });

    test("fails with statuscode 400 id is invalid", async () => {
      const invalidId = "5a3d5da59070081a82a3445";

      await api.get(`/api/notes/${invalidId}`).expect(400);
    });
  });

  describe("addition of a new note", () => {
    test("succeeds with valid data", async () => {
      const newNote = {
        content: "async/await simplifies making async calls",
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
      expect(contents).toContain("async/await simplifies making async calls");
    });

    test("fails with status code 400 if data invaild", async () => {
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
  });

  describe("deletion of a note", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const notesAtStart = await notesInDb();
      const noteToDelete = notesAtStart[0];

      await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

      const notesAtEnd = await notesInDb();

      expect(notesAtEnd.length).toBe(initialNotes.length - 1);

      const contents = notesAtEnd.map(r => r.content);

      expect(contents).not.toContain(noteToDelete.content);
    });

    describe('when there is initially one user at db', () => {
        beforeEach(async () => {
          await User.deleteMany({})
          const user = new User({ username: 'root', password: 'sekret' })
          await user.save()
        })
      
        test('creation succeeds with a fresh username', async () => {
          const usersAtStart = await helper.usersInDb()
      
          const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
          }
      
          await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)
      
          const usersAtEnd = await helper.usersInDb()
          expect(usersAtEnd.length).toBe(usersAtStart.length + 1)
      
          const usernames = usersAtEnd.map(u => u.username)
          expect(usernames).toContain(newUser.username)
        })
  });
});

afterAll(() => {
  mongoose.connection.close();
});
