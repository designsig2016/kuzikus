var express = require('express');
var router = express.Router();

var mongoose = require('mongoose') ;
var Schema = mongoose.Schema ; 

//Mongoose connection to MongoDB
mongoose.connect('mongodb://localhost:27017/kuzi_test',function (error) {
	if (error) {
		console.log(error)
	}
})

//Mongoose general Schema & model definition : mongoose.model(name,schema,collection)

var JsonSchema = new Schema({
	name : String, 
	type : Schema.Types.Mixed 
});
var Json = mongoose.model('JString',JsonSchema,'layercollection')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET GeoJSON data */
router.get('/mapjson/:name',function (req,res){
	if (req.params.name) {
		Json.findOne({name: req.params.name},{},function (err,docs) {
			res.json(docs);
		});
	}
});

module.exports = router;
