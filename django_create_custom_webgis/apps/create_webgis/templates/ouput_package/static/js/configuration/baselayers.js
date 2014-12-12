BASELAYERS = {


            google_phy: new OpenLayers.Layer.Google(
                "Google Physical",
                {type: google.maps.MapTypeId.TERRAIN,numZoomLevels: 16}
            ),

            google_hyb: new OpenLayers.Layer.Google(
                "Google Hybrid",
                {type: google.maps.MapTypeId.HYBRID,numZoomLevels: 20}
            ),

            google_sat: new OpenLayers.Layer.Google(
                "Google Satellite",
                {
                    type: google.maps.MapTypeId.SATELLITE,numZoomLevels: 22

                }
            ),

            openstreetmap: new OpenLayers.Layer.OSM(
                    "OpenStreetMap"

            )


};
