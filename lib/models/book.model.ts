import mongoose from "mongoose";
const uuid = require("uuid");

const bookSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => uuid.v4().toString(),
  },
  bookId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    index: true,
  },
  subtitle: {
    type: String,
    required: false,
    index: true,
  },
  description: {
    type: String,
    required: false,
  },
  categories: [
    {
      type: String,
      required: true,
    },
  ],
  authors: [
    {
      type: String,
      required: true,
    },
  ],
  cover: {
    type: String,
    required: false,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
  },
});

const Book = mongoose.models.Book || mongoose.model("Book", bookSchema);

export default Book;
