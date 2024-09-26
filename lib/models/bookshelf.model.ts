import mongoose from "mongoose";
const uuid = require("uuid");

const bookshelfSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => uuid.v4().toString(),
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  bookReviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BookReview",
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

const Bookshelf =
  mongoose.models.Bookshelf || mongoose.model("Bookshelf", bookshelfSchema);

export default Bookshelf;
