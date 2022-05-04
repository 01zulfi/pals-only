const mongoose = require('mongoose');

const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: Schema.ObjectId, ref: 'User' },
    body: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Message', MessageSchema);
