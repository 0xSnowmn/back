let mongoose = require("mongoose"),
express = require("express"),
router = express.Router();

// Key Model
const Update = require("./db/update.js");
const Program = require("./db/programs.js");

exports.New = async (req, res) => {
    const prog = await Program.findOne({name:req.body.prog});
    if (prog == null) {
        return res.status(400).json({ error: "Error" });
      }
      Update.create({
        Program: req.body.prog,
        Version: version,
		Urge:	req.body.urge
      },(err,resp) => {
		prog.updateOne({"version":version})
		res.status(201).json(resp);
});
      
  };
exports.All = async (req, res) => {
    const updates = Update.find({},(err,resp) =>{
	if(err){res.status(200).json({err:err});
		}
	res.status(200).json(resp);
});
      
};

exports.delete = async (req,res) => {
		Update.findOneAndDelete({'Version':version,'Program':req.body.prog},(err,data) => {
			if(data !== null){
				res.json({msg:"deleted"})
			}
		})
}
 
exports.urge = async (req,res) => {
	const Updatea = await Update.find({'Program':req.body.prog,'Urge':true}).sort({Version:-1}).exec(function(err, data) {
        // use your case insensitive sorted results
		var versions = []
		var version = req.body.version
		version = version.replace('v','')
		version = parseFloat(version)
		data.forEach(el => {
			var mm = el.Version.replace('v','')
			if(version > parseFloat(mm)) {
				
			} else {
				if(!versions.includes(parseFloat(mm))) versions.push(parseFloat(mm))
			}
		})
		const largeV = versions.sort((a,b)=>a-b)[versions.length - 1]
		if(largeV > version){
			res.status(401).send({update:true,version:largeV})
		} else {
			res.status(200).send({update:null})
		}
    });
}

exports.latest = async (req,res) => {
	const Updatea = await Update.find({'Program':req.body.prog,'Urge':false}).sort({Version:-1}).exec(function(err, data) {
        // use your case insensitive sorted results
		var versions = []

		data.forEach(el => {
			var mm = el.Version.replace('v','')
			version = el.Version.replace('v','')
			version = parseFloat(version)
			if(version > parseFloat(mm)) {
				
			} else {
				if(!versions.includes(parseFloat(mm))) versions.push(parseFloat(mm))
			}
		})
		const largeV = versions.sort((a,b)=>a-b)[versions.length - 1]
		if(largeV > version){
			res.status(202).json({update:true,version:largeV})
		} else {
			res.status(200).json({update:false})
		}
    });
}

exports.edit = async (req,res) => {
const Update = Update.findOne({'Program':req.body.prog})
	if(Update !== null) {
		Update.updateOne({'Version':version,'Urge':req.body.urge})	
	}
}

exports.deleteAll = async (req,res) => {
Update.deleteMany({}, function ( err ) {
		});
		res.json({msg:"All Deleted"})
}


router.post('/new',this.New)
router.get('/all',this.All)
router.post('/urge',this.urge)
router.post('/latest',this.latest)
router.delete('/delete',this.delete)
router.put('/edit',this.edit)
router.delete('/deleteAll',this.deleteAll)

module.exports = router;
