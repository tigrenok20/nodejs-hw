import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  res.status(200).json(await Note.find());
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = req.body;

  const createdNote = await Note.create(note);

  res.status(201).json(createdNote);
};

export const updateNote = async (req, res) => {
  const note = req.body;
  const { noteId } = req.params;

  const updatedNode = await Note.findOneAndUpdate(
    { _id: noteId }, // Шукаємо по id
    note,
    { returnDocument: 'after' }, // повертаємо оновлений документ
  );

  if (!updatedNode) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(updateNote);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
