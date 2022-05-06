let mongoose = require("mongoose"),
express = require("express"),
router = express.Router();

// Key Model
const User = require("./db/users.js");

exports.registerNewUser = async (req, res) => {

      const user = new User({
        name: req.body.name,
        password: req.body.pass
      });
      let data = await user.save();
      const token = await user.generateAuthToken(); // here it is calling the method that we created in the model
      res.status(201).json({ data, token });
  };

  exports.loginUser = async (req, res) => {
    try {
      const email = req.body.name;
      const password = req.body.pass;
      const user = await User.findByCredentials(email, password);
      if (user == false) {
        return res.status(401).json({ error: "Login failed! Check authentication credentials" });
      }
      const token = await user.generateAuthToken();
      res.status(201).json({ user, token });
    } catch (err) {
      res.status(400).json({ err: err });
    }
  };
router.post('/register',this.registerNewUser)
router.post('/login',this.loginUser)

module.exports = router;
