WMSLAYERS = {

            FWI : new OpenLayers.Layer.WMS("Fire Weather Index (FWI)",
                                   "http://geohub.jrc.ec.europa.eu/forest/effis/mapserv/fwi?",
                                   {
                                       layers: "fd_ecmwf14_FWI",
                                       day: getTodaysDate(),
                                       forecast: '1'

                                   },

                                   {
                                       opacity: 0.5,
                                       singleTile: false,
                                       transparent: true,
                                       buffer: 0,
                                       displayInLayerSwitcher: true,
                                       visibility: true,
                                       isBaseLayer: false

                                   }
                 )
};


function getTodaysDate() {
    var m_names = new Array("Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul", "Aug", "Sep",
        "Oct", "Nov", "Dec");

    today = new Date();
    return today.getDate() + '-' + m_names[today.getMonth()] + '-' + today.getFullYear();


}