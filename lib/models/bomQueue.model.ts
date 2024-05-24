import mongoose from "mongoose";
const uuid = require("uuid");

const bomQueueSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => uuid.v4().toString(),
  },
  communityId: {
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
  bookSessions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookSession",
      required: true,
    },
  ],
  status: {
    type: String,
    enum: ["Pending", "Active", "Completed", "Cancelled"],
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

const BomQueue =
  mongoose.models.BomQueue || mongoose.model("BomQueue", bomQueueSchema);

export default BomQueue;