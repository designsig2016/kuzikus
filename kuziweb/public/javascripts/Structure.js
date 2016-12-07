
function addTempFeatureStructure() {
    var tFeature = {
            'type': 'Feature',
            'properties': {
                'name': 'new name',
                'structuretype':'',
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
        if(ll.getProperties().name == "observation_structure") {
            obsLayer = ll;
            break;
        }
    }

    var reader = new ol.format.GeoJSON();
    tempFeature = reader.readFeature(tFeature);
    obsLayer.getSource().addFeature(tempFeature);
    
    document.getElementById("nameinput").value = tFeature.properties.name;
    document.getElementById("Structureinput").value = tFeature.properties.structuretype;
    document.getElementById("commentinput").value = tFeature.properties.comment;
    document.getElementById("dateinput").value = tFeature.properties.added;
    document.getElementById("Xinput").value = tFeature.geometry.coordinates[0];
    document.getElementById("Yinput").value = tFeature.geometry.coordinates[1];
    document.getElementById("PhotoId").value = tFeature.geometry.image;
    updateFormDisplayStructure()
}

function updateFormDisplayStructure() {
    document.getElementById("IDc").style.display ="block";
    document.getElementById("Xc").style.display ="none";
    document.getElementById("Yc").style.display ="none";
    document.getElementById("Comc").style.display ="block";
    document.getElementById("Addc").style.display ="block";
    document.getElementById("Phoc").style.display ="block";
    document.getElementById("Spec").style.display ="none";
    document.getElementById("Sexc").style.display ="none";
    document.getElementById("Nb_animals").style.display ="none";
    document.getElementById("Structuretype").style.display ="block";
    document.getElementById("woodtypediv").style.display ="none";    
}


function updateEditedFeatureStructure() {
    editedFeature.setProperties({ "name": document.getElementById("nameinput").value});
    editedFeature.setProperties({ "type": document.getElementById("Structureinput").value});
    editedFeature.setProperties({ "comment": document.getElementById("commentinput").value});
    editedFeature.setProperties({ "added": document.getElementById("dateinput").value});
    editedFeature.setProperties({ "image": document.getElementById("PhotoId").value });
    var geom = new ol.geom.Point([document.getElementById("Xinput").value, 
        document.getElementById("Yinput").value]);
    editedFeature.setGeometry(geom);
}

function updateFormStructure(feature) {
    document.getElementById("IDinput").value = feature.getProperties().id;
    document.getElementById("nameinput").value = feature.getProperties().name;
    document.getElementById("Structureinput").value = feature.getProperties().type;
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
    updateFormDisplay_herd()

}


// action exécutée sur click sur le bouton save
function savedataStructure(callback) {
    var request = window.superagent;
    var observation = { id:document.getElementById("IDinput").value,
                        name: document.getElementById("nameinput").value,
                        type: document.getElementById("Structureinput").value,
                        comment: document.getElementById("commentinput").value,
                        added: document.getElementById("dateinput").value,
                        image: document.getElementById("PhotoId").value,
                        geometry: { type: "point", coordinates: [ 
                            document.getElementById("Xinput").value, 
                            document.getElementById("Yinput").value]},
                      };

    if(mode === 'add') {
        request
            .post('/form/observation_structure')
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
            .put('/form/observation_structure/updateItem')
            .send(observation)
            .end(function(err, res) {
                if (err) {
                    return callback(null, 'Erreur de connexion au serveur, ' + err.message);
                }
                if (res.status !== 200) {
                    return callback(null, res.text);
                };
                updateEditedFeature1();
                callback(null, 'updated');
        });
    }            
}


function addObservationsStructure(layer, callback) {
	var request = window.superagent;
	request
		.get('/form/observation_structure')
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
                            "type":data[i].type,
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