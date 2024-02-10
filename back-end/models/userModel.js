const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  picture: { type: String, required: true },
  bookmarks: [
    // { type: Schema.Types.ObjectId, ref: 'MediaBookmarked' }
  ],
  mediaVisitedHistory: [
    // { type: Schema.Types.ObjectId, ref: 'MediaBookmarked' }
  ],
  messages: [
    // { type: Schema.Types.ObjectId, ref: 'Messages' }
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
