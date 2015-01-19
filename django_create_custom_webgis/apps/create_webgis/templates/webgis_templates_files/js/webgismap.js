function init() {
				var options = {
					projection: new OpenLayers.Projection('EPSG:900913'),
					displayProjection: new OpenLayers.Projection('EPSG:4326'),
					maxExtent:	new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
						maxResolution: 156543.0339,
						units: 'm',
						numZoomLevels: 30
					};


                map = new OpenLayers.Map('map',options);

				{% autoescape off %}
    				{{ baselayers}}
    				{{ wmslayers}}
				{% endautoescape %}


//              var baseMapLayers = [BASELAYERS["google_hyb"],BASELAYERS["openstreetmap"]];
//		        var wmsMapLayers =  [WMSLAYERS["FWI"]];
//		        map.addLayers(baseMapLayers);
//		        map.addLayers(wmsMapLayers);


                var wms_info_control = new OpenLayers.Control.WmsInfoControl();
                wms_info_control.wmsLayersInfo = [WMSLAYERS["FWI"]];
                map.addControls([new OpenLayers.Control.LayerSwitcher(), wms_info_control]);
                wms_info_control.activate();
                map.zoomToMaxExtent();

}


