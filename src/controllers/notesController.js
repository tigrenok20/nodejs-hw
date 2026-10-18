import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const { page, perPage, tag, search } = req.query;
  const skip = (page - 1) * perPage;
  const notesQuery = Note.find({ userId: req.user._id });

  if (tag) {
    notesQuery.where('tag').equals(tag);
  }

  if (search) {
    notesQuery.where({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ],
    });
  }

  const [totalNotes, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage),
  ]);

  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages: Math.ceil(totalNotes / perPage),
    notes,
  });
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOne({ _id: noteId, userId: req.user._id });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = req.body;

  const createdNote = await Note.create({ ...note, userId: req.user._id });

  res.status(201).json(createdNote);
};

export const updateNote = async (req, res) => {
  const note = req.body;
  const { noteId } = req.params;

  const updatedNode = await Note.findOneAndUpdate(
    { _id: noteId, userId: req.user._id }, // Шукаємо по id

    note,
    { returnDocument: 'after' }, // повертаємо оновлений документ
  );

  if (!updatedNode) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(updatedNode);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
