const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Key = new Schema({
KeyStr: {
	type: String
},
Expire: {
	type: String
},
Mac: {
	type: String
},
}, {
	collection: 'keys'
})

module.exports = mongoose.model('Key', Key)
