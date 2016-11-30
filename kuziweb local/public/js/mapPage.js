$(document).ready(function(){
    var style = new ol.style.Style({
        fill: new ol.style.Fill({
          color: "rgba(255, 255, 255, 0.6)"
    	}),
        stroke: new ol.style.Stroke({
          color: "#319FD3",
          width: 1
        }),
        text: new ol.style.Text({
          font: "12px Calibri,sans-serif",
          fill: new ol.style.Fill({
            color: "#000"
          }),
          stroke: new ol.style.Stroke({
            color: "#fff",
            width: 3
    	   })
        })
    });
      
    // Vector layer from a GeoJson file url
	var boreholes = new ol.layer.Vector({
		source: new ol.source.Vector({
			url: "/jsonfiles/boreholes",
			format: new ol.format.GeoJSON(),
			projection: "EPSG:3857"
		})
	});
	var fire = new ol.layer.Vector({
		source: new ol.source.Vector({
			format: new ol.format.GeoJSON(),
			url: "./layers/burned_areas.geojson",
			projection: "EPSG:3857"
		})
	});
	var roads = new ol.layer.Vector({
		source: new ol.source.Vector({
			format: new ol.format.GeoJSON(),
			url: "./layers/roads.geojson",
			projection: "EPSG:3857"
		})
	});
            
      var raster = new ol.layer.Tile({
	    preload: 4,
        source: new ol.source.OSM()
      });

      var source = new ol.source.Vector({wrapX: false});
      
      var vector = new ol.layer.Vector({
        source: source
      });
      var layers = [];
    layers.push(raster);
    layers.push(vector);	
    layers.push(roads);	
   
	// MAP
	var view = new ol.View({
        // the view"s initial state
        center: ol.proj.fromLonLat([18.39,-23.23]),
          zoom: 12
      });
	var map = new ol.Map({
		layers: layers,
		loadTilesWhileAnimating: true,
		target: "map",
		controls: ol.control.defaults({
		  attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
			collapsible: false
		  })
		}),
		view: view
	});
      
    // Add selected layers to map
    $('label').click(function(event) {
    	addLayers();
	});

    function addLayers() {
		var layers = document.getElementsByClassName("layers");
		var all = [];//rareanimals,flora,herds,boreholes,structures,fire,bush,wood (we now have borholes (all[3]) and fire (all[5]))
		var checked = [];
		var checkedInd = [];
		var unchecked = [];
		for (i = 0; i < 8; i++) {//put names of checked and unchecked labels in an array
			all.push(layers[i].name);
			if(layers[i].checked){
				checked.push(layers[i].name);
				checkedInd.push(all.indexOf(layers[i].name))
			}
			else{
    			unchecked.push(layers[i].name);
    		}
		}
		layers = []; // empty layers, we don"t want to add new ones every time
    	layers.push(raster);
	    layers.push(vector);
		layers.push(roads);	
	    var text = [];
	    for(i=0;i<checked.length;i++){
			switch(checked[i].toString()){// add checked layers to map
				case "boreholes":
					layers.push(boreholes);
					break;
				case "fire":
					layers.push(fire);	
					break;
				default:
					text.push("did nothing");
			}
		}
		// debugging: document.getElementById("test").innerHTML = "Selected Layers: "+checked.toString()+" (number of layers:"+layers.length+")";
	    layers[1].setMap(map);
	    for(i=0;i<layers.length;i++){ // show all selected layers on the map
	    	layers[i].setMap(map);
	    }
	}
    var highlightStyleCache = {};

    var featureOverlay = new ol.layer.Vector({
        source: new ol.source.Vector(),
        map: map,
        style: function(feature, resolution) {
          var text = resolution < 5000 ? feature.get("name") : "";
          if (!highlightStyleCache[text]) {
            highlightStyleCache[text] = new ol.style.Style({
              stroke: new ol.style.Stroke({
                color: "#f00",
                width: 1
              }),
              fill: new ol.style.Fill({
                color: "rgba(255,0,0,0.1)"
              }),
              text: new ol.style.Text({
                font: "12px Calibri,sans-serif",
                text: text,
                fill: new ol.style.Fill({
                  color: "#000"
                }),
                stroke: new ol.style.Stroke({
                  color: "#f00",
                  width: 3
                })
              })
            });
          }
          return highlightStyleCache[text];
        }
      });

      var highlight;
      var displayFeatureInfo = function(pixel) {

        var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
          return feature;
        }); 
        
        var info = document.getElementById("info");
        if (feature) {
          info.innerHTML = feature.getId() + ": " + feature.get("name");
        } else {
          info.innerHTML = "&nbsp;";
        }

        if (feature !== highlight) {
          if (highlight) {
            featureOverlay.getSource().removeFeature(highlight);
          }
          if (feature) {
            featureOverlay.getSource().addFeature(feature);
          }
          highlight = feature;
        }

      };

      map.on("pointermove", function(evt) {
        if (evt.dragging) {
          return;
        }
        var pixel = map.getEventPixel(evt.originalEvent);
        displayFeatureInfo(pixel);
      });

      map.on("click", function(evt) {
        displayFeatureInfo(evt.pixel);
      });
      
      // Easter Egg: fly to Bern
      // from https://github.com/DmitryBaranovskiy/raphael
      function bounce(t) {
        var s = 7.5625, p = 2.75, l;
        if (t < (1 / p)) {
          l = s * t * t;
        } else {
          if (t < (2 / p)) {
            t -= (1.5 / p);
            l = s * t * t + 0.75;
          } else {
            if (t < (2.5 / p)) {
              t -= (2.25 / p);
              l = s * t * t + 0.9375;
            } else {
              t -= (2.625 / p);
              l = s * t * t + 0.984375;
            }
          }
        }
        return l;
      }

      // from https://github.com/DmitryBaranovskiy/raphael
      function elastic(t) {
        return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
      }
		
	var bern = ol.proj.fromLonLat([7.4458, 46.95]);

        var flyToBern = document.getElementById("fly-to-bern");
      flyToBern.addEventListener("click", function() {
        var duration = 2000;
        var start = +new Date();
        var pan = ol.animation.pan({
          duration: duration,
          source: /** @type {ol.Coordinate} */ (view.getCenter()),
          start: start
        });
        var bounce = ol.animation.bounce({
          duration: duration,
          resolution: 4 * view.getResolution(),
          start: start
        });
        map.beforeRender(pan, bounce);
        view.setCenter(bern);
      }, false);
   }); //jquery end