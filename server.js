let express = require('express');
let mongoose = require('mongoose');
let cors = require('cors');
let bodyParser = require('body-parser');
let dbConfig = require('./db/conn');

// Express Route
const keysController = require('./keysController.js')
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGODB_URI
MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    // db pointing to newdb
    console.log("Switched to "+db.databaseName+" database");
    // create 'users' collection in newdb database
    db.createCollection("users", function(err, result) {
        if (err) throw err;
        console.log("Collection is created!");
        // close the connection to db when you are done with it
        db.close();
    });
});
/* mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db).then(() => {
console.log('Database successfully connected!')
},
error => {
	console.log('Could not connect to database')
}
) */

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/keys', keysController)


// PORT
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
console.log('Connected to port ' + port)
})

// 404 Error
app.use((req, res, next) => {
res.status(404).send('Error 404!')
});

app.use(function (err, req, res, next) {
console.error(err.message);
if (!err.statusCode) err.statusCode = 500;
res.status(err.statusCode).send(err.message);
});
