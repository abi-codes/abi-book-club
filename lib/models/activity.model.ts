import mongoose from "mongoose";
const uuid = require("uuid");

const activitySchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => uuid.v4().toString(),
  },
  creatorUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  recieverUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  creatorCommunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  objectId: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  notificationType: {
    type: String,
    enum: ["reply", "like", "queue", "vote", "bom"],
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

const Activity =
  mongoose.models.Activity || mongoose.model("Activity", activitySchema);

export default Activity;
