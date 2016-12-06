
// ready function for show/hide the "other" text cell if clicking on "other" radio button
$(document).ready(function() {
         
        $('#otherText').hide(); // on cache le champ par défaut 
        var rad = document.type.typeWood;

        for (var i =0;i<rad.length;i++){
              rad[i].onclick = function(){  //when click on one of the radio
                var type = document.querySelector('input[name=typeWood]:checked').value;
                if(type=="Other") { // if "other" is selected
                  $('#otherText').show();
                } else {
              $('#otherText').hide();            
              } 
            };
        }
});

//--------------------------


function addTempFeatureWoodressource() { //define the properties of the feature
    var tFeature = {
        'type': 'Feature',
        'properties': {
            'name': 'new name',
            'comment': 'no comment',
            'woodtype': 'Dead tree',
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
        if(ll.getProperties().name == "woodressource") {
            obsLayer = ll;
            break;
        }
    }

    
    var reader = new ol.format.GeoJSON();
    tempFeature = reader.readFeature(tFeature);
    obsLayer.getSource().addFeature(tempFeature);
    
    document.getElementById("nameinput").value = tFeature.properties.name;
    document.getElementById("commentinput").value = tFeature.properties.comment;
    document.getElementById(tFeature.properties.woodtype).checked = true; //check Dead tree by default
    $('#otherText').hide();  //hide the "other" text cell by default
    document.getElementById("otherText").value =''; //make "other" text cell empty by default
    document.getElementById("dateinput").value = tFeature.properties.added;
    document.getElementById("Xinput").value = tFeature.geometry.coordinates[0];
    document.getElementById("Yinput").value = tFeature.geometry.coordinates[1];
    document.getElementById("PhotoId").value = tFeature.geometry.image;
    updateFormDisplayWoodressource()
}

function updateFormDisplayWoodressource() { //defin what we want to display on the sidebar
    document.getElementById("IDc").style.display ="block";
    document.getElementById("Xc").style.display ="none";
    document.getElementById("Yc").style.display ="none";
    document.getElementById("Spec").style.display ="none";
    document.getElementById("Sexc").style.display ="none";
    document.getElementById("woodtypediv").style.display ="block";
    document.getElementById("Comc").style.display ="block";
    document.getElementById("Addc").style.display ="block";
    document.getElementById("Phoc").style.display ="block";
}


function updateEditedFeatureWoodressource() { //Edition mode: 

    //managing the "other" properties for ADDITION
    var woodtypeinput = document.querySelector('input[name=typeWood]:checked').value; //get the value of the woodtype checked 
    if (woodtypeinput == "Other") {
        woodtypeinput =  document.getElementById("otherText").value; //if it is "Other", woodtype input is equal to the value in the "other" textcell  
    }
    //---

    editedFeature.setProperties({ "name": document.getElementById("nameinput").value});
    editedFeature.setProperties({ "woodtype": woodtypeinput});
    editedFeature.setProperties({ "comment": document.getElementById("commentinput").value});
    editedFeature.setProperties({ "added": document.getElementById("dateinput").value});
    editedFeature.setProperties({ "image": document.getElementById("PhotoId").value });
    var geom = new ol.geom.Point([document.getElementById("Xinput").value, 
        document.getElementById("Yinput").value]);
    editedFeature.setGeometry(geom);
}

function updateFormWoodressource(feature) {  //Edition mode: display the current properties of the selected feature

    //managing the "other" properties for EDITION
    var woodtypeinput = feature.getProperties().woodtype; //get the value of woodtype in the database
    var woodt= document.type.typeWood;      //array with all the possible woodtype in mapPage.html (Dead tree, Brushes or Other)
    var otherType = '';
    for (var i =0;i<woodt.length;i++){
        if ( i == woodt.length-1){          //if we reach the last value in the array (= if the type is Other)...
            otherType = woodtypeinput;      //store the value of the woodtype (for display in the "other" textcell)
            woodtypeinput = woodt[i].value; //input is equal to "Other"
            $('#otherText').show(); 
        }
        else if(woodtypeinput == woodt[i].value){$('#otherText').hide();break; 
        }
    }

    document.getElementById("IDinput").value = feature.getProperties().id;
    document.getElementById("nameinput").value = feature.getProperties().name;
    
    document.getElementById(woodtypeinput).checked = true;      //check the input woodtype
    document.getElementById("otherText").value = otherType;     //if it is other, display its real value in the "other" textcell

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
    updateFormDisplayWoodressource() //then display only the useful properties

}


// action exécutée sur click sur le bouton save
function savedataWoodressource(callback) {
    var request = window.superagent;

    //managing the "other" properties when saving (same as in updateEditedFeatureWoodressource)
    var woodtypeinput = document.querySelector('input[name=typeWood]:checked').value;
    if (woodtypeinput == "Other") {
        woodtypeinput =  document.getElementById("otherText").value;
    }

    var observation = { id:document.getElementById("IDinput").value,
    name: document.getElementById("nameinput").value,
    woodtype: woodtypeinput,
    comment: document.getElementById("commentinput").value,
    added: document.getElementById("dateinput").value,
    image: document.getElementById("PhotoId").value,
    geometry: { type: "point", coordinates: [ 
    document.getElementById("Xinput").value, 
    document.getElementById("Yinput").value]},
    };

if(mode === 'add') {
    request
    .post('/form/woodressource')
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
    .put('/form/woodressource/updateItem')
    .send(observation)
    .end(function(err, res) {
        if (err) {
            return callback(null, 'Erreur de connexion au serveur, ' + err.message);
        }
        if (res.status !== 200) {
            return callback(null, res.text);
        };
        updateEditedFeatureWoodressource();
        callback(null, 'updated');
    });
}            
}


function addWoodressource(layer, callback) {
	var request = window.superagent;
	request
  .get('/form/woodressource')
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
                "woodtype": data[i].woodtype,
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