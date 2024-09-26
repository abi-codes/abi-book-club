import mongoose from "mongoose";
import { start } from "repl";
const uuid = require("uuid");

const bomSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => uuid.v4().toString(),
  },
  bookSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BookSession",
    required: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
  },
});

const Bom = mongoose.models.Bom || mongoose.model("Bom", bomSchema);

export default Bom;
