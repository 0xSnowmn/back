let express = require('express');
let mongoose = require('mongoose');
let cors = require('cors');
let bodyParser = require('body-parser');
let dbConfig = require('./db/conn');

// Express Route
const keysController = require('./keysController.js')
const users = require('./users.js')
const program = require('./program.js')
const update = require('./updates.js')
const auth = require('./auth.js')
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db).then(() => {
console.log('Database successfully connected!')
},
error => {
	console.log('Could not connect to database',error)
}
)

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.all('*', auth);
app.use('/api/keys',keysController)
app.use('/api/programs',program)
app.use('/api/updates',update)
app.use('/api/users', users)


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
