
function addTempFeature_inc_dead() {
    var tFeature = {
            'type': 'Feature',
            'properties': {
                'name': 'new name',
                'species': '',
                'sex':'',
                'comment': 'no comment',
                'added': '',
                'image':''
            },
            'geometry': {
                'type': 'Point',
                'coordinates': curCoord
            }
        };
    for(var i = 0; i<map.getLayers().getArray().length; i++) {
        var ll = map.getLayers().getArray()[i];
        if(ll.getProperties().name == "observation_inc_dead") {
            obsLayer = ll;
            break;
        }
    }

    var reader = new ol.format.GeoJSON();
    tempFeature = reader.readFeature(tFeature);
    obsLayer.getSource().addFeature(tempFeature);
    
    document.getElementById("nameinput").value = tFeature.properties.name;
    document.getElementById("speciesinput").value = tFeature.properties.species;
    document.getElementById("sexinput").value = tFeature.properties.sex;
    document.getElementById("commentinput").value = tFeature.properties.comment;
    document.getElementById("dateinput").value = tFeature.properties.added;
    document.getElementById("Xinput").value = tFeature.geometry.coordinates[0];
    document.getElementById("Yinput").value = tFeature.geometry.coordinates[1];
    document.getElementById("PhotoId").value = tFeature.geometry.image;
    updateFormDisplay_inc_dead()
}

function updateFormDisplay_inc_dead() {
    document.getElementById("IDc").style.display ="block";
    document.getElementById("Xc").style.display ="none";
    document.getElementById("Yc").style.display ="none";
    document.getElementById("Comc").style.display ="none";
    document.getElementById("Addc").style.display ="block";
    document.getElementById("Phoc").style.display ="block";
    document.getElementById("Spec").style.display ="block";
    document.getElementById("Sexc").style.display ="block";
}


function updateEditedFeature_inc_dead() {
    editedFeature.setProperties({ "name": document.getElementById("nameinput").value});
    editedFeature.setProperties({ "species": document.getElementById("speciesinput").value});
    editedFeature.setProperties({ "sex": document.getElementById("sexinput").value});
    editedFeature.setProperties({ "comment": document.getElementById("commentinput").value});
    editedFeature.setProperties({ "added": document.getElementById("dateinput").value});
    editedFeature.setProperties({ "image": document.getElementById("PhotoId").value });
    var geom = new ol.geom.Point([document.getElementById("Xinput").value, 
        document.getElementById("Yinput").value]);
    editedFeature.setGeometry(geom);
}

function updateForm_inc_dead(feature) {
    document.getElementById("IDinput").value = feature.getProperties().id;
    document.getElementById("nameinput").value = feature.getProperties().name;
    document.getElementById("speciesinput").value = feature.getProperties().species;
    document.getElementById("sexinput").value = feature.getProperties().sex;
    document.getElementById("commentinput").value = feature.getProperties().comment;
    document.getElementById("dateinput").value = feature.getProperties().added;
    document.getElementById("Xinput").value = feature.getProperties().geometry.
        getCoordinates()[0];
    document.getElementById("Yinput").value = feature.getProperties().geometry.
        getCoordinates()[1];
    document.getElementById("PhotoId").value = feature.getProperties().image;
    if(feature.getProperties().image != ''){
        document.getElementById("imgElement").src = '/file/' + feature.getProperties().image;
    }
    updateFormDisplay_inc_dead()

}


// action exécutée sur click sur le bouton save
function savedataobs_inc_dead(callback) {
    var request = window.superagent;
    var observation = { id:document.getElementById("IDinput").value,
                        name: document.getElementById("nameinput").value,
                        species: document.getElementById("speciesinput").value,
                        sex: document.getElementById("sexinput").value,
                        comment: document.getElementById("commentinput").value,
                        added: document.getElementById("dateinput").value,
                        image: document.getElementById("PhotoId").value,
                        geometry: { type: "point", coordinates: [ 
                            document.getElementById("Xinput").value, 
                            document.getElementById("Yinput").value]},
                      };

    if(mode === 'add') {
        request
            .post('/form/observation_inc_dead')
            .send(observation)
            .end(function(err, res) {
                if (err) {
                    return callback(null, 'Erreur de connexion au serveur, ' + err.message);
                }
                if (res.status !== 200) {
                    return callback(null, res.text);
                }
                var jsonResp = JSON.parse(res.text);
                callback(jsonResp);
        });
    }   
    else if(mode ==='mod') {
        request
            .put('/form/observation_inc_dead/updateItem')
            .send(observation)
            .end(function(err, res) {
                if (err) {
                    return callback(null, 'Erreur de connexion au serveur, ' + err.message);
                }
                if (res.status !== 200) {
                    return callback(null, res.text);
                };
                updateEditedFeature_inc_dead();
                callback(null, 'updated');
        });
    }            
}


function addObservations_inc_dead(layer, callback) {
	var request = window.superagent;
	request
		.get('/form/observation_inc_dead')
        .end(function(err, res) {
            if (err) {
                return callback(null, 'Erreur de connexion au serveur, ' + err.message);
            }
            if (res.status !== 200) {
                return callback(null, res.text);
            }
            var data = JSON.parse(res.text);
            for (i = 0; i < data.length; i++) {
                var geojsonFeature = {
                        "type": "Feature",
                        "properties": {
                            "id": data[i]._id,
                            "name": data[i].name,
                            "species":data[i].species,
                            "sex":data[i].sex,
                            "comment": data[i].comment,
                            "added": data[i].added,
                            "image": data[i].image
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [Number(data[i].geometry.coordinates[0]),
                                Number(data[i].geometry.coordinates[1])]
                        }
                };
                var reader = new ol.format.GeoJSON();
                var olFeature = reader.readFeature(geojsonFeature);
                layer.getSource().addFeature(olFeature);
            }
        });
}