var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Mongoose connection to MongoDB
mongoose.connect('mongodb://localhost:27017/kuzikus', function (error) {
    if (error) {
        console.log(error);
    }
});

// Mongoose general Schema & model definition: mongoose.model(name, schema, collection)
var JsonSchema = new Schema({
    name: String,
    type: Schema.Types.Mixed
});
var Json = mongoose.model('JString', JsonSchema, 'layercollection');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET GeoJSON data. */
router.get('/layers/:name', function (req, res) {
    if (req.params.name) {
        Json.findOne({ name: req.params.name },{}, function (err, docs) {
            res.json(docs);
        });
    }
});

router.post('/form', function(req, res) {
    console.log(req.body);
    var newObs = new observation(req.body);
    newObs.save(function(err,newobj) {
        if(err) {
            res.send(err.message);
        }
        else { 
            res.send(newobj);
        };
    });
});

module.exports = router;