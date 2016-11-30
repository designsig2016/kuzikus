var map ; 
var tempFeature ; //Temporary Feature assigned to obsLayer
var obsLayer ; 


//Styles couches vecteurs
var roadsStyle = new ol.style.Style({
    stroke : new ol.style.Stroke({color :'rgba(255,0,0,1)',width:1.5})

}); 

var buildingsStyle = new ol.style.Style({
    fill : new ol.style.Fill({color:'black'}),
    stroke : new ol.style.Stroke({color :'black',width:1.5})
}); 

var Point_Style = new ol.style.Style({
        image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({color: 'white'}),
                stroke: new ol.style.Stroke({color: 'orange', width: 1})
        })
});

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
};

// ajoute un objet provisoire dans le couche des observations
function mapClick(e) {
    if(mode==="add") {
        tempFeature = {
            'type': 'Feature',
            'properties': {
                'name': '',
                'comment': '',
                'added': '',
                'image':''
            },
            'geometry': {
                'type': 'Point',
                'coordinates': e.coordinate
            }
        };
        var reader = new ol.format.GeoJSON();
        var olFeature = reader.readFeature(tempFeature);
        obsLayer.getSource().addFeature(olFeature);
        
        document.getElementById("speciesinput").value = tempFeature.properties.name;
        var x = document.getElementsByClassName("commentinput") ;
        x[0].value = tempFeature.properties.comment;
        x[1].value = tempFeature.properties.comment;
        var x = document.getElementsByClassName("dateinput") ;
        x[0].value = tempFeature.properties.added;
        x[1].value = tempFeature.properties.added;
        var x = document.getElementsByClassName("Xinput") ; 
        x[0].value = tempFeature.geometry.coordinates[0];
        x[1].value = tempFeature.geometry.coordinates[0];
        var x = document.getElementsByClassName("Yinput") ; 
        x[0].value = tempFeature.geometry.coordinates[1];
        x[1].value = tempFeature.geometry.coordinates[1];         
        document.getElementById("form").style.visibility ="visible";
    }
};

//Change form type 

      function showDiv(select){
         if(select.value=="inc_dead"){
          document.getElementById('form_dead').style.display = "block";
          document.getElementById('form_fence').style.display = "none" ; 
         } if (select.value=="inc_fence"){
          document.getElementById('form_dead').style.display = "none";
          document.getElementById('form_fence').style.display = "block";
         }
      };



//Datepicker
    
$(document).ready(function(){

      $(function() {
        $( ".dateinput" ).datepicker();
      } );
});


//Get Mouse position 

      var mousePositionControl = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(4),
        projection: 'EPSG:32734',
        // comment the following two lines to have the mouse position
        // be placed within the map.
        //className: 'custom-mouse-position',
        //target: document.getElementById('mouse-position'),
        undefinedHTML: '&nbsp;'
      });



$(document).ready(function(){
      var projectionSelect = document.getElementById('projection');
      projectionSelect.addEventListener('change', function(event) {
        mousePositionControl.setProjection(ol.proj.get(event.target.value));
      });
});

// actions exécutées lorsqu'une observation a été stockée dans la BD Mongo
 function onsaved(arg,msg) {
    if(arg == null){
        console.log(msg);
    }
    else {
        //do something with the new feature
        if(mode == 'add') { tempFeature._id = arg._id; }
    }
    document.getElementById("addButton").style.color="black";
    document.getElementById("modButton").style.color="black";
    document.getElementById("form").style.visibility ="hidden";
}

// // action exécutée sur click sur le bouton save (1ère partie, on stocke l'image s'il y en a une)
// function saveform(callback) {
//     savedata(callback);
// }


// // action exécutée sur click sur le bouton save (2ème partie, on stocke les variable - dont l'id de l'image)
// function savedata(callback) {
//     var request = window.superagent;
//     var observation = { id:document.getElementById("IDinput").value,
//                         name: document.getElementById("nameinput").value,
//                         comment: document.getElementById("commentinput").value,
//                         added: document.getElementById("dateinput").value,
//                         image: null,
//                         geometry: { type: "point", coordinates: [ 
//                             document.getElementById("Xinput").value, 
//                             document.getElementById("Yinput").value]},
//                       };

//     if(mode === 'add') {
//         request
//             .post('/form')
//             .send(observation)
//             .end(function(err, res) {
//                 if (err) {
//                     return callback(null, 'Erreur de connexion au serveur, ' + err.message);
//                 }
//                 if (res.status !== 200) {
//                     return callback(null, res.text);
//                 }
//                 var jsonResp = JSON.parse(res.text);
//                 callback(jsonResp);
//         });
//     }                 
// }

// action exécutée sur le bouton annuler
function cancelform() {
    onsaved(null,'cancelled');
}

//OL map creation

$(document).ready(function(){

  proj4.defs("EPSG:32734","+proj=utm +zone=34 +south +datum=WGS84 +units=m +no_defs");

// // Crée la carte Lat/Lon avec une couche de fond OpenStreetMap
//     var map = new ol.Map({
//         layers: [
//       new ol.layer.Tile({
//                 source: new ol.source.OSM()
//             })
//         ],
//         target: 'map',
//         view: new ol.View({
//       center: ol.proj.transform([230243,7424116],'EPSG:32734','EPSG:3857'),
//       zoom: 12
//     })
//     });

      var map = new ol.Map({
        controls: ol.control.defaults({
          attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
          collapsible: false
          })
        }).extend([mousePositionControl]),
        target: 'map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
          ],
        view: new ol.View({
          projection:'EPSG:3857',
          //projection:'EPSG:32734',
          center: ol.proj.transform([230243,7432700],'EPSG:32734','EPSG:3857'),
          //center : [234022,7432053], 
          zoom: 12
        })
      });

      var vector = new ol.layer.Vector({
            style:roadsStyle, 
            source : new ol.source.Vector({
              url:'layers/roads.geojson',
              format:new ol.format.GeoJSON({
                defaultDataProjection:'EPSG:32734',
                featureProjection:'EPSG:32734'
              })
            })
          }); 
          map.addLayer(vector) ; 

          vector = new ol.layer.Vector({
            style:buildingsStyle,
            source : new ol.source.Vector({
              url:'layers/buildings.geojson',
              format:new ol.format.GeoJSON({
                defaultDataProjection:'EPSG:32734',
                featureProjection:'EPSG:32734'
              })
            })
          });
          map.addLayer(vector) ; 

          vector = new ol.layer.Vector({
            source : new ol.source.Vector({
              url:'/mapjson/Fences',
              format:new ol.format.GeoJSON({
                defaultDataProjection:'EPSG:32734',
                FeatureProjection:'EPSG:32734'
              })

            })
          });
          map.addLayer(vector) ; 

          obsLayer = new ol.layer.Vector({
            style: Point_Style,
            source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
              projection: 'EPSG:32734'
            })
          });
          map.addLayer(obsLayer); 

          document.getElementById("addButton").onclick =setMode ; 
          document.getElementById("modButton").onclick =setMode ; 
          map.on('click',mapClick) ;

          document.getElementById("cancelBtn").onclick = cancelform;
          document.getElementById("saveBtn").onclick = function() {saveform(onsaved)};
});
