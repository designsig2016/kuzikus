
function addTempFeature1() {
    var tFeature = {
            'type': 'Feature',
            'properties': {
                'name': 'new name',
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
        if(ll.getProperties().name == "observation1") {
            obsLayer = ll;
            break;
        }
    }

    var reader = new ol.format.GeoJSON();
    tempFeature = reader.readFeature(tFeature);
    obsLayer.getSource().addFeature(tempFeature);
    
    document.getElementById("nameinput").value = tFeature.properties.name;
    document.getElementById("commentinput").value = tFeature.properties.comment;
    document.getElementById("dateinput").value = tFeature.properties.added;
    document.getElementById("Xinput").value = tFeature.geometry.coordinates[0];
    document.getElementById("Yinput").value = tFeature.geometry.coordinates[1];
    document.getElementById("PhotoId").value = tFeature.geometry.image;
    updateFormDisplay1()
}

function updateFormDisplay1() {
    document.getElementById("IDc").style.display ="block";
    document.getElementById("Xc").style.display ="none";
    document.getElementById("Yc").style.display ="none";
    document.getElementById("Comc").style.display ="block";
    document.getElementById("Addc").style.display ="block";
    document.getElementById("Phoc").style.display ="block";
}


function updateEditedFeature1() {
    editedFeature.setProperties({ "name": document.getElementById("nameinput").value});
    editedFeature.setProperties({ "comment": document.getElementById("commentinput").value});
    editedFeature.setProperties({ "added": document.getElementById("dateinput").value});
    editedFeature.setProperties({ "image": document.getElementById("PhotoId").value });
    var geom = new ol.geom.Point([document.getElementById("Xinput").value, 
        document.getElementById("Yinput").value]);
    editedFeature.setGeometry(geom);
}

function updateForm1(feature) {
    document.getElementById("IDinput").value = feature.getProperties().id;
    document.getElementById("nameinput").value = feature.getProperties().name;
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
    updateFormDisplay1()

}


// action exécutée sur click sur le bouton save
function savedataobs1(callback) {
    var request = window.superagent;
    var observation = { id:document.getElementById("IDinput").value,
                        name: document.getElementById("nameinput").value,
                        comment: document.getElementById("commentinput").value,
                        added: document.getElementById("dateinput").value,
                        image: document.getElementById("PhotoId").value,
                        geometry: { type: "point", coordinates: [ 
                            document.getElementById("Xinput").value, 
                            document.getElementById("Yinput").value]},
                      };

    if(mode === 'add') {
        request
            .post('/form/observation1')
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
            .put('/form/observation1/updateItem')
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


function addObservations1(layer, callback) {
	var request = window.superagent;
	request
		.get('/form/observation1')
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