const mongoose = require("mongoose");
const { Schema } = mongoose;

const notesSchema = new Schema({
  Title: {
    type: String,
    required: true,
  },
  descreption: {
    type: String,
    required: true,
    
  },
  tag: {
    type: String,
   default: 'General',
  },
  date: {
    type: date,
    default: date.now,
  },
});

module.exports = mongoose.model("Notes", notesSchema);
