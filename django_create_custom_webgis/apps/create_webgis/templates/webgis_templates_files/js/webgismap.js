function init() {
				var options = {
					projection: new OpenLayers.Projection('EPSG:900913'),
					displayProjection: new OpenLayers.Projection('EPSG:4326'),
					maxExtent:	new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
						maxResolution: 156543.0339,
						units: 'm',
						numZoomLevels: 30
					};
                var map = new OpenLayers.Map('map',options);
				{% autoescape off %}
    				{{ baselayers}}
    				{{ wmslayers}}
				{% endautoescape %}

                map.zoomToMaxExtent();

                map.addControl( new OpenLayers.Control.LayerSwitcher() );
}


