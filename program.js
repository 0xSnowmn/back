let mongoose = require("mongoose"),
express = require("express"),
router = express.Router();

// Key Model
const Program = require("./db/programs.js");
const Key = require("./db/keys.js");
exports.New = async (req, res) => {
    const prog = await Program.findByName(req.body.name);
    if (prog !== false) {
        return res.status(400).json({ error: "Error" });
      }
      Program.create({
        name: req.body.name,
        price: req.body.price
      },(err,resp) => {
	res.status(201).json(resp);
});
      
  };
exports.All = async (req, res) => {
    const prog = Program.find({},(err,resp) =>{
	if(err){res.status(200).json({err:err});
		}
	res.status(200).json(resp);
});
      
};
exports.stats = async (req,res) => {
	Program.aggregate([{ $project: { "_id": 0, "name": 1,}}, {
		$lookup: {
			from: "keys",
			localField: "name",
			foreignField: "Program",
			as: "keys"
		},
	},{ $project: { "_id": 0, "Mac": 0,}}],function (error, data) {
	 return res.json(data);
});
}

exports.delete = async (req,res) => {
		Program.findOneAndDelete({name:req.body.name},(err,data) => {
			res.json({msg:"deleted"})
		})
}

exports.edit = async (req,res) => {
const program = Program.findOne({'name':req.body.name})
	if(program !== null) {
		program.updateOne({'name':req.body.name,'price':req.body.price})	
	}
}

exports.deleteAll = async (req,res) => {
Program.deleteMany({}, function ( err ) {
		});
		res.json({msg:"All Deleted"})
}


router.post('/new',this.New)
router.get('/all',this.All)
router.get('/all_stats',this.stats)
router.delete('/delete',this.delete)
router.put('/edit',this.edit)
router.delete('/deleteAll',this.deleteAll)

module.exports = router;
