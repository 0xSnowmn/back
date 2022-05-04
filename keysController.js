let mongoose = require("mongoose"),
express = require("express"),
router = express.Router();
moment = require("moment")

// Key Model
let Key = require("./db/keys");
router.use(function(req, res, next) {
    if(req.headers['x-iam-ghonem']) {
		next()
	} else {
		res.json({msg:"NOT_AUTH "})
	}
});


// Check If Key Is Expired Or Not
router.get("/check", async (req, res) => {
	const reqKey = await Key.findOne({KeyStr:req.query.key})
	if(reqKey) {
		Key.findOne({KeyStr:req.query.key},(err,data) => {
			var data = JSON.parse(JSON.stringify(data))
			var ExpireData = moment(String(data.Expire),'M/D/YYYY');
			var RealDate = moment(new Date().toLocaleDateString(),'M/D/YYYY');
			var diffDays = ExpireData.diff(RealDate, 'days');
			if(diffDays < 0) {
				res.json({isExpired:'true',mac:data.Mac})
			} else {
				res.json({isExpired:'false',mac:data.Mac})
			}
		})
	} else {
		res.status(401).json({msg:"not Found"})
	}
});

router.put('/usg',async (req,res) => {
	const reqKey = await Key.findOne({KeyStr:req.body.key})
	var newvalues = { $set: {Mac: req.body.mac } };

	Key.updateOne({KeyStr:req.body.key}, newvalues, function(err, res2) {
		res.json({data:res2})
	})
	
})

router.post('/cmt0',(req,res) => {
		const k = makeKey(32)
		Key.create({KeyStr:k,Expire:req.body.expireDate,Mac:''},(err,data) => {
			res.json({key:k,expire:req.body.expireDate})
			if(err){
				return
			}
		})
	
	
})

router.delete('/dlt1',(req,res) => {
	if(req.headers.x_iam_ghonem) {
		Key.findOneAndDelete({KeyStr:req.body.KeyStr},(err,data) => {
			res.json({msg:"deleted"})
		})
	} else {
		res.json({msg:"error"})
	}
	
})

router.delete('/dlt',(req,res) => {
	if(req.headers['x-iam-ghonem']) {
		Key.deleteMany({}, function ( err ) {
		});
		res.json({msg:"All Deleted"})
	} else {
		res.json({msg:"adew"})
	}
	
})

function makeKey(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}


module.exports = router;
