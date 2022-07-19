let mongoose = require("mongoose"),
express = require("express"),
router = express.Router();
moment = require("moment")

const keys = require("./db/keys");
// Key Model
let Key = require("./db/keys");
// Check If Key Is Expired Or Not
router.get("/check", async (req, res) => {
	const reqKey = await Key.findOne({'Key':req.query.key})
	if(reqKey !== null) {
		console.log(reqKey)
			var data = JSON.parse(JSON.stringify(reqKey))
			var ExpireData = moment(String(data.Expire),'M/D/YYYY');
			var RealDate = moment(new Date().toLocaleDateString(),'M/D/YYYY');
			var diffDays = ExpireData.diff(RealDate, 'days');
			if(diffDays < 0 ) {
				res.json({isExpired:'true'})
			} else if(data.Mac == '' || data.Mac == req.query.mac ) {
					reqKey.updateOne({
						"Last_Used":String(new Date().toLocaleDateString()),"Mac":req.query.mac},
						 function(err,resp) {
					   res.status(200).json({isExpired:'false',mac:data.Mac})
				   })
			}  else if(req.query.mac !== data.Mac){
				res.status(401).send({msg:"mac"})
			} 
	} else {
		res.status(401).send({msg:"not Found"})
	}
});

router.post('/create',(req,res) => {
		const k = makeKey(32)
		if(req.body.expireDate == null || req.body.program == null ){
			res.status(407).json({error:"Missed Params"})
			return
		}
		Key.create({Key:k,Expire:req.body.expireDate,Mac:'',Last_Used:'',Program:req.body.program},(err,data) => {
			res.json({key:k,expire:req.body.expireDate})
			if(err){
				return
			}
		})
})

router.get('/stats',(req,res) => {
	keys.aggregate([{ $project: { "_id": 0,"__v":0}}],(err,resp) => {
		var data = []
		resp.forEach(el => {
			var ExpireData = moment(String(el.Expire),'M/D/YYYY');
             var RealDate = moment(new Date().toLocaleDateString(),'M/D/YYYY');
             var diffDays = ExpireData.diff(RealDate, 'days');
			 var status = ''
             if(diffDays > 0) {
               status = 'Valid'
             } else {
               status = 'Expired'
             }
			 data.push({'key':el.Key,'program':el.Program,'mac':el.Mac,'last_used':el.Last_Used,'status':status,'expire':el.Expire})
		})
		res.json(data)
	})
})

router.delete('/delete',(req,res) => {
		Key.findOneAndDelete({KeyStr:req.body.KeyStr},(err,data) => {
			res.json({msg:"deleted"})
		})
})

router.delete('/dlt',(req,res) => {
		Key.deleteMany({}, function ( err ) {
		});
		res.json({msg:"All Deleted"})
	
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
