

$(document).ready(function(){
  $("#includedContent").load("formulaire_plantes.html"); 
  $("#hide").click(function(){
    $(".layers").toggle(400);

  });
});



//Display "other" textarea 


$(document).ready(function() {
   

$('#otherText').hide(); // on cache le champ par défaut 
var rad = document.type.typeWood;

for (var i =0;i<rad.length;i++){
      rad[i].onclick = function(){  //when click on one of the radio
        if(document.getElementById("other").checked==true) { // if "other" is selected
          $('#otherText').show();
            } else {
          $('#otherText').hide();            
            } 
    };
  }
});

//Datepicker

$(document).ready(function(){

  $(function() {
    $( ".date_obs" ).datepicker();
  } );
});

//Define EPSG:32734 projection

$(document).ready(function(){

  proj4.defs("EPSG:32734","+proj=utm +zone=34 +south +datum=WGS84 +units=m +no_defs");

  var map = new ol.Map({
    target: 'map',
    layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    }),
    new ol.layer.Vector({
      source : new ol.source.Vector({
        url:'layers/roadsOld.geojson',
        format:new ol.format.GeoJSON({
          defaultDataProjection:'EPSG:32734',
          featureProjection:'EPSG:32734'
        })
      })
    }),
    new ol.layer.Vector({
      source : new ol.source.Vector({
        url:'layers/buildings.geojson',
        format:new ol.format.GeoJSON({
          defaultDataProjection:'EPSG:32734',
          featureProjection:'EPSG:32734'
        })
      })
    })
    ],
    view: new ol.View({
          //projection:'EPSG:3857',
          projection:'EPSG:32734',
          //center: ol.proj.transform([230243,7424116],'EPSG:32734','EPSG:3857'),
          center : [234022,7432053], 
          zoom: 12
        })
  });

});


