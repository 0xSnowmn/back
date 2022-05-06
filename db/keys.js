const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Key = new Schema({
Key: {
	type: String
},
Program: {
	type: String
},
Mac: {
	type: String
},
Last_Used: {
	type: String
},
Expire: {
	type: String
},
}, {
	collection: 'keys'
})

module.exports = mongoose.model('Key', Key)
