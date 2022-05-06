const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  price: {
    type: String,

  },

});
userSchema.statics.findByName = async (name) => {
  const user = await Program.findOne({'name': name });
  if (user ) {
    return true
  }
  return false;
};
const Program = mongoose.model("Program", userSchema);
module.exports = Program;
