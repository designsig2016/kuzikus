var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var grid = require('gridfs-stream');
var fs = require('fs');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

// Mongoose connection to MongoDB
mongoose.connect('mongodb://localhost:27017/kuzikus', function (error) {
    if (error) {
        console.log(error);
    }
});

grid.mongo = mongoose.mongo;
var gfs = new grid(mongoose.connection.db);

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
router.get('/mapjson/:name', function (req, res) {
    if (req.params.name) {
        Json.findOne({ name: req.params.name },{}, function (err, docs) {
            res.json(docs);
        });
    }
});


router.post('/file', upload.single('fileToUpload'),function(req, res, next) {
    if (!req.file) {
        return next(new ServerError('Wrong file post request: file not found in request', 
                { context: 'files route', status: 403 }));
    }
    var writestream = gfs.createWriteStream({
        mode: 'w',
        content_type: req.file.mimetype,
        filename: req.file.originalname
    });
    fs.createReadStream(req.file.path).pipe(writestream);
    console.log('last step');
    writestream.on('close', function(newFile) {
        return res.status(200).json({ _id: newFile._id });
    });
});

router.get('/file/:fileId', function(req, res, next) {
    if (!req.params || !req.params.fileId) {
        return next(new ServerError('Wrong file get request: no id specified',
            { context: 'files route', status: 403 }));
    }
    var id = gfs.tryParseObjectId(req.params.fileId);
    if (!id) {
        return next(new ServerError('Wrong file get request: invalid file id',
            { context: 'files route', status: 403 }));
    }
    gfs.files.find({ _id: id }).toArray(function (err, files) {
        if (err || !files || files.length !== 1) {
            return next(new ServerError('Could not read file info ' + req.params.fileId + ' error: ' + err,
                { context: 'files route', status: 403 }));
        }
        var fileInfo = files[0];
        var readstream = gfs.createReadStream({
            _id: req.params.fileId
        });
        readstream.on('error', function(err) {
            return next(new ServerError('Could not read file ' + req.params.fileId + ' error: ' + err, 
                { context: 'files route', status: 403 }));
        });
        if (fileInfo.contentType) {
            res.setHeader('Content-type', fileInfo.contentType);
        }
        res.setHeader('Content-disposition', 'filename=' + fileInfo.filename);
        return readstream.pipe(res);
    });
});


//******* pour observations 1 ****************************************

var obs1 = new Schema({
    name : String,
    comment: String,
    added: String,
    image:String,
    geometry : {
        type: { type: String },
        coordinates: []
    }
});
var observation1 = mongoose.model('observation1', obs1, 'observations1');

router.post('/form/observation1', function(req, res) {
    console.log(req.body);
    var newObs = new observation1(req.body);
    newObs.save(function(err,newobj) {
        if(err) {
            res.send(err.message);
        }
        else { 
            res.send(newobj);
        };
    });
});

router.get('/form/observation1', function(req,res) {
    observation1.find({}, function(err,docs){
        res.send(docs);
    });
});

router.put('/form/observation1/updateItem', function(req, res) {
    var id = req.body.id, body = req.body;
    observation1.findByIdAndUpdate(id, body, function(err, docs) {
        if(err) {
            res.send(err.message);
        }
        else { 
            res.send("OK");
        };
    });
});

//******* pour observations 2 ****************************************

//etc...

//****** Observation : incident - dead animal observation_inc_dead **********************

var obs_inc_dead = new Schema({
    name : String,
    species : String,
    sex : String,
    comment: String,
    added: String,
    image:String,
    geometry : {
        type: { type: String },
        coordinates: []
    }
});
var observation_inc_dead = mongoose.model('observation_inc_dead', obs_inc_dead, 'observations_inc_dead');

router.post('/form/observation_inc_dead', function(req, res) {
    console.log(req.body);
    var newObs = new observation_inc_dead(req.body);
    newObs.save(function(err,newobj) {
        if(err) {
            res.send(err.message);
        }
        else { 
            res.send(newobj);
        };
    });
});

router.get('/form/observation_inc_dead', function(req,res) {
    observation_inc_dead.find({}, function(err,docs){
        res.send(docs);
    });
});

router.put('/form/observation_inc_dead/updateItem', function(req, res) {
    var id = req.body.id, body = req.body;
    observation_inc_dead.findByIdAndUpdate(id, body, function(err, docs) {
        if(err) {
            res.send(err.message);
        }
        else { 
            res.send("OK");
        };
    });
});

//******* pour woodressource ****************************************

var woodressourceSC = new Schema({
    name : String,
    woodtype : String,
    comment: String,
    added: String,
    image:String,
    geometry : {
        type: { type: String },
        coordinates: []
    }
});
var woodressource = mongoose.model('woodressource', woodressourceSC, 'woodressources');

router.post('/form/woodressource', function(req, res) {
    console.log(req.body);
    var newObs = new woodressource(req.body);
    newObs.save(function(err,newobj) {
        if(err) {
            res.send(err.message);
        }
        else { 
            res.send(newobj);
        };
    });
});

router.get('/form/woodressource', function(req,res) {
    woodressource.find({}, function(err,docs){
        res.send(docs);
    });
});

router.put('/form/woodressource/updateItem', function(req, res) {
    var id = req.body.id, body = req.body;
    woodressource.findByIdAndUpdate(id, body, function(err, docs) {
        if(err) {
            res.send(err.message);
        }
        else { 
            res.send("OK");
        };
    });
});

module.exports = router;

//**************************************************** Rare Plants
var obsRarePlant = new Schema({
    name : String,
    ConservationLevel: String,
    comment: String,
    added: String,
    image:String,
    geometry : {
        type: { type: String },
        coordinates: []
    }
});
var RarePlant = mongoose.model('RarePlant', obsRarePlant, 'RarePlant');

router.post('/form/RarePlant', function(req, res) {
    console.log(req.body);
    var newObs = new observation1(req.body);
    newObs.save(function(err,newobj) {
        if(err) {
            res.send(err.message);
        }
        else { 
            res.send(newobj);
        };
    });
});

router.get('/form/RarePlant', function(req,res) {
    observation1.find({}, function(err,docs){
        res.send(docs);
    });
});

router.put('/form/RarePlant/updateItem', function(req, res) {
    var id = req.body.id, body = req.body;
    observation1.findByIdAndUpdate(id, body, function(err, docs) {
        if(err) {
            res.send(err.message);
        }
        else { 
            res.send("OK");
        };
    });
});

//******* fire (Cyril) ****************************************

var obs1 = new Schema({
    name : String,
    comment: String,
    added: String,
    image:String,
    geometry : {
        type: { type: String },
        coordinates: []
    }
});
var fire = mongoose.model('fire', fire, 'fire');

router.post('/form/fire', function(req, res) {
    console.log(req.body);
    var newObs = new fire(req.body);
    newObs.save(function(err,newobj) {
        if(err) {
            res.send(err.message);
        }
        else { 
            res.send(newobj);
        };
    });
});

router.get('/form/fire', function(req,res) {
    fire.find({}, function(err,docs){
        res.send(docs);
    });
});

router.put('/form/fire/updateItem', function(req, res) {
    var id = req.body.id, body = req.body;
    fire.findByIdAndUpdate(id, body, function(err, docs) {
        if(err) {
            res.send(err.message);
        }
        else { 
            res.send("OK");
        };
    });
});

