import mongoose from "mongoose";
const uuid = require("uuid");

const bookSessionSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => uuid.v4().toString(),
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  votes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  status: {
    type: String,
    enum: ["Active", "Cancelled", "Completed", "Pending"],
    default: "Pending",
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
  },
});

const BookSession =
  mongoose.models.BookSession ||
  mongoose.model("BookSession", bookSessionSchema);

export default BookSession;
