

    $(document).ready(function(){
          $("#includedContent").load("formulaire_plantes.html"); 
        $("#hide").click(function(){
            $(".layers").toggle(400);
            
        });
    });

    
    
//Change form type 

$(document).ready(function(){

      function showDiv(select){
         if(select.value=="inc_dead"){
          document.getElementById('inc_dead_div').style.display = "block";
          document.getElementById('inc_fence_div').style.display = "none" ; 
         } if (select.value=="inc_fence"){
          document.getElementById('inc_dead_div').style.display = "none";
          document.getElementById('inc_fence_div').style.display = "block";
         }
      };
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

    //ol.proj.addCoordinateTransforms
    //example : examples/wms-custom-proj 
});
//Get Mouse position 

$(document).ready(function(){

      var mousePositionControl = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(4),
        projection: 'EPSG:32734',
        // comment the following two lines to have the mouse position
        // be placed within the map.
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position'),
        undefinedHTML: '&nbsp;'
      });

      var projectionSelect = $('#projection');
      projectionSelect.on('change', function() {
        mousePositionControl.setProjection(ol.proj.get(this.value));
      });
      projectionSelect.val(mousePositionControl.getProjection().getCode());

});

//OL map creation

$(document).ready(function(){

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
          }),
          new ol.layer.Vector({
            source : new ol.source.Vector({
              url:'layers/roadsOld.geojson',
              format:new ol.format.GeoJSON({
                defaultDataProjection:'EPSG:32734',
                //featureProjection:'EPSG:32734'
              })
            })
          }),
          new ol.layer.Vector({
            source : new ol.source.Vector({
              url:'layers/buildings.geojson',
              format:new ol.format.GeoJSON({
                defaultDataProjection:'EPSG:32734',
                //featureProjection:'EPSG:32734'
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

    
