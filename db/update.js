const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Update = new Schema({
Version: {
	type: String
},
Program: {
	type: String
},
Urge: {
	type: Boolean
}
}, {
	collection: 'updates',
	timestamps: true
})
Update.statics.findByName = async (name) => {
	const update = await Update.findOne({'name': name });
	if (update ) {
	  return true
	}
	return false;
  };

module.exports = mongoose.model('Update', Update)
