WMSLAYERS = {

            FWI : new OpenLayers.Layer.WMS("'Fire Weather Index (FWI)'",
                                   "http://geohub.jrc.ec.europa.eu/forest/effis/mapserv/fwi?",
                                   {
                                       layers: "fd_ecmwf14_FWI",
                                       day: "14-Jan-2015",
                                       forecast: '1'

                                   },

                                   {
                                       opacity: 0.5,
                                       singleTile: true,
                                       transparent: true,
                                       buffer: 0,
                                       displayInLayerSwitcher: true,
                                       visibility: true,
                                       isBaseLayer: false

                                   }
                 )
};
