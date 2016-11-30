var map;
var tempFeature;
var obsLayer;
var form;
var editedFeature;
var popup;
var curCoord;

	

//Définition de quelques styles pour les couches vecteur

var Buildings_Style = new ol.style.Style({ 
    fill: new ol.style.Fill({ color: 'rgba(200, 200, 200, 1)', width: 4 }),
    stroke: new ol.style.Stroke({ color: 'rgba(255,255,255,1)', width: 1 })
});
                
var Fences_Style = new ol.style.Style({ 
    stroke: new ol.style.Stroke({ color: 'rgba(255,0,0,1)', width: 3})
});

var Roads_Style = new ol.style.Style({ 
    stroke: new ol.style.Stroke({ color: 'rgba(0,0,0,1)', width: 2 })
});

var Point_Style = new ol.style.Style({
        image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({color: 'black'}),
                stroke: new ol.style.Stroke({color: 'black', width: 0})
        })
});


// affiche une image du fichier image sélectionné dans le tag imgElement
function onFileSelected(event) {
    var selectedFile = event.target.files[0];
    var reader = new FileReader();

    var imgtag = document.getElementById("imgElement");
    imgtag.title = selectedFile.name;

    reader.onload = function(event) {
        imgtag.src = event.target.result;
    };
    reader.readAsDataURL(selectedFile);
}
    
// gestion du fonctionnement des boutons add et modify
var mode = "none";   
function setMode() {
    if(this.id == "addButton") {
        document.getElementById("modButton").style.color="black";
        if(mode==="add") {
            mode="none";
            this.style.color = "black";
        }
        else {
            mode = "add";
            this.style.color = "red";
        } 
    }
    else if(this.id == "modButton") {
        document.getElementById("addButton").style.color="black";
        if(mode==="mod") {
            mode="none";
            this.style.color = "black";
        }
        else {
            mode = "mod";
            this.style.color = "red";
        } 
    }
}

function addTempFeature(action) {
    switch (action) {
        case '1':
            addTempFeature1();
            break;
        case '2':
            addTempfeature2();
            break;
    }
    document.getElementById("form").style.visibility ="visible";
    curCoord = null;
}


// ajoute un objet provisoire dans le couche des observations
function mapClick(e) {
    curCoord = e.coordinate;
	if(mode==="add") {

        // Création et affichage du popup
        var el = document.createElement("div"); 
        var title = document.createElement("h4");
        title.innerHTML = 'Créer une nouvelle observation?';
        el.appendChild(title);
        var content = document.createElement("div");

        content.innerHTML = '<ul><li><a href="#" data-action="1">Observation 1</a></li>' +
                                '<li><a href="#" data-action="2">Observation 2</a></li>'+
                            '</ul>';

        el.appendChild(content);
        popup.show(e.coordinate, el);

    }
    else if(mode==="mod") {
	    this.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
	    	//if(layer === obsLayer) {
                switch (layer.getProperties().name) {
                    case 'observation1':
                        updateForm1(feature);
                        break;
                    case 'observation2':
                        updateForm2(feature);
                        break;
                } 
				document.getElementById("form").style.visibility ="visible";
				obsLayer = layer;
                editedFeature = feature;
				return;
			//}
	    });
	}
}

// actions exécutées lorsqu'une observation a été stockée dans la BD Mongo
 function onsaved(arg, msg) {
    if(arg == null){
        logMessage(arg, msg);
    }
    else {
        //do something with the new feature
        if(mode == 'add') { tempFeature._id = arg._id; }
    }
    document.getElementById("addButton").style.color="black";
    document.getElementById("modButton").style.color="black";
    document.getElementById("form").style.visibility ="collapse";
    mode = "none";
}

function logMessage(arg, msg) {
    console.log(msg);
}


// action exécutée sur click sur le bouton save
function saveform(callback) {
    var files = document.getElementById("fileinput").files;
    if(files.length >0) {
        var file = files[0];
        var request = window.superagent;
        request
            .post('/file')
            .attach('fileToUpload',file,file.name)
            .end(function(err, res) {
                if (res.status !== 200) {
                    return callback(null, res.text);
                }
                document.getElementById("PhotoId").value = res.body._id;
                savedata(callback);
            });
    }
    else {
        savedata(callback); 
    }
}

function savedata(callback) {
    switch (obsLayer.getProperties().name) {
        case 'observation1':
            savedataobs1(callback);
            break;
        case 'observation2':
            savedataobs2(callback);
            break;
    }  
}




// action exécutée sur le bouton annuler
function cancelform() {
    if(mode === 'add') {
        obsLayer.getSource().removeFeature(tempFeature);
    }
    editedFeature = null;
    onsaved(null,'cancelled');
}

// ajout initial des observations stockées dans la BD
function addObservations(layer, name, callback) {
    switch (name) {
        case 'observation1':
            addObservations1(layer, callback);
            break;
        case 'observation2':
            addObservations2(layer, callback);
            break;
    }
}


//Script executé lorsque la page est chargée

$(document).ready(function(){
    
    // Crée la carte Lat/Lon avec une couche de fond OpenStreetMap
    map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                visible: true,
                name: 'Bing Aerial',
                preload: Infinity,
                source: new ol.source.BingMaps({
                    key: 'AprP0vrE1DPXFClpddIWcrayE_6Jxy6MaQnaCWZddG2GVS6QlBv1Eg2iitsG9JIQ',
                    imagerySet: 'Aerial'
                })
            }),
			new ol.layer.Tile({
                visible: false,
                name: 'Open Street Map',
                source: new ol.source.OSM()
            })
        ],
        target: 'map',
        view: new ol.View({
            center: ol.proj.transform([18.4, -23.2],'EPSG:4326', 'EPSG:3857'),
			zoom: 11
		})
    });

    //Ajout de collections geojson de mongo

    var vector = new ol.layer.Vector({
		style: Buildings_Style,
        name: 'Buildings',
		source: new ol.source.Vector({
			url: '/mapjson/buildings',
			format: new ol.format.GeoJSON(),
		})
    });
    map.addLayer(vector);        
    
	vector = new ol.layer.Vector({
		style: Fences_Style,
        name: 'Fences',
		source: new ol.source.Vector({
			url: '/mapjson/fences',
			format: new ol.format.GeoJSON(),
		})
	});
	map.addLayer(vector);

    vector = new ol.layer.Vector({
        style: Roads_Style,
        name: 'Roads',
        source: new ol.source.Vector({
            url: '/mapjson/roads',
            format: new ol.format.GeoJSON(),
        })
    });
    map.addLayer(vector);


    //******* pour chaque type d'observations ************

    // Ajout de la couche "observations" (nb. pas d'url, donc pas de contenu)
    var name = "observation1"
    var layer = new ol.layer.Vector({
        name: "observation1",
        style: Point_Style,
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
        })
    });
    map.addLayer(layer);   

    //Ajout des observations à la couche observation
    addObservations(layer, name, logMessage);  
    
    //****************************************************


    document.getElementById("addButton").onclick = setMode;
    document.getElementById("modButton").onclick = setMode;
    map.on('singleclick', mapClick);

    document.getElementById("cancelBtn").onclick = cancelform;
    document.getElementById("saveBtn").onclick = function() {saveform(onsaved)};



    // Ajout du popup
    popup = new ol.Overlay.Popup();
    map.addOverlay(popup);

    popup.getElement().addEventListener('click', function(e) {
        var action = e.target.getAttribute('data-action');
        if (action) {
            popup.hide();
            addTempFeature(action);
        }
    }, false);


});