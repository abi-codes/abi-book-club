import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  phoneCode: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  occupation: {
    type: String,
    required: false,
  },
  image: String,
  backgroundImage: String,
  bio: String,
  address: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
  ],
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entry",
    },
  ],
  onboarded: {
    type: Boolean,
    default: false,
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
  bookshelf: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bookshelf",
    },
  ],
  createdDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
  },
  role: {
    type: String,
    required: false,
    default: "reader",
  },
  visibility: {
    type: Boolean,
    required: true,
    default: false,
  },
  status: {
    type: String,
    required: false,
    default: "active",
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
