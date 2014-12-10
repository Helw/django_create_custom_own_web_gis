/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control.js
 */

/**
 * Class: OpenLayers.Control.Chart
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.ChartControl = OpenLayers.Class(OpenLayers.Control, {

    marker_layer: '',
    chart_feature: '',
    url: '',
    lonlat: null,
    noSelectMessage: '',
    chart: null,
    feature_style: '',

    y: 0,
    x: 0,
    xy: 0,

    /**
     * Constructor: OpenLayers.Control.MouseDefaults
     */
    initialize: function () {

        this.handlers = {};
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
    },
    deactivate: function () {

        this.map.events.un({
            "click": this.defaultChart,
            scope: this
        });
        this.map.div.style.cursor = "arrow";
        OpenLayers.Control.prototype.deactivate.apply(this, arguments);
    },
    destroy: function () {
        this.deactivate();
        if (this.handler) {
            this.handler.destroy();
        }
        this.handler = null;
        this.map.events.un({
            "click": this.defaultChart,
            scope: this
        });
        this.map.div.style.cursor = "arrow";
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },
    activate: function () {


        this.set_feature_style();
        this.map.events.on({
            "click": this.defaultChart,
            scope: this
        });
        this.map.div.style.cursor = "crosshair";
        return OpenLayers.Control.prototype.activate.apply(this, arguments);


    },
    defaultChart: function (evt) {


        if (this.isGoogle) {
            alert('unfortunately the charts do not work at the google background zoom level.');
            return false;
        }

        this.x = evt.xy.x;
        this.y = evt.xy.y;
        this.lonlat = this.map.getLonLatFromViewPortPx(evt.xy);
        this.runQuery();
        OpenLayers.Event.stop(evt);
    },

    set_feature_style : function () {


        var imgSrc = '/static/template_map_viewer/images/marker-chart.png';
        var bgImgSrc = '/static/template_map_viewer/images/marker_shadow.png';
        this.feature_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        this.feature_style.externalGraphic = imgSrc;
        this.feature_style.backgroundGraphic = bgImgSrc;
        this.feature_style.backgroundXOffset = 0;
        this.feature_style.backgroundYOffset = -25;
        this.feature_style.graphicZIndex = 10;
        this.feature_style.backgroundGraphicZIndex = 11;
        this.feature_style.fillOpacity = '1';
        this.feature_style.graphicWidth = 21;
        this.feature_style.graphicHeight = 25;
        this.feature_style.graphicOpacity = 1;
        this.feature_style.graphicXOffset = -10;
        this.feature_style.graphicYOffset = -25;

    },

    setLayers: function (lys) {
        this.layers = lys;
    },


    setAppChartUrl: function(url_array) {

        /*
        * Get 3 items :
        *    [0] pre lon url
        *    [1] post lon url (lat)
        *    [2] post lat url
        */
        this.url_array = url_array;


    },


    set_Lon_Lat_Url : function(lon,lat){



        this.url = this.url_array[0] + lon + this.url_array[1] + lat + this.url_array[2];



    },

    runQuery: function () {

        this.addMarker();
        var map_width = this.map.size.w; //1166 or 1888
        var adjustment = 0;
        if (map_width > 1200) {
            adjustment = 350;
        }

        var posX = this.x - map_width + 1000 + adjustment;
        var posY = this.y - 100;
        if (posX < 0) {
            posX = this.x + 480 - adjustment;
        }
        normLatLon = OpenLayers.Layer.SphericalMercator.inverseMercator(this.lonlat.lon, this.lonlat.lat);
        this.set_Lon_Lat_Url(normLatLon.lon, normLatLon.lat);

        /* need a check for if already exists */

        try {
            req_chart.abort();
        } catch (err) {
        }
        req_chart = OpenLayers.Request.GET({url: this.url, success: buildChart, scope: this});
    },
    addMarker: function () {

        this.removeMarkerFeature();
        this.chart_feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(this.lonlat.lon, this.lonlat.lat), null, this.feature_style);
        this.chart_feature.id = 'fChartMarker';
        this.marker_layer.addFeatures([this.chart_feature]);
        return true;
    },
    removeMarkerFeature: function () {
        if (this.chart_feature) {

            this.chart_feature.destroy()

        }
        return true;
    },

    ajaxError: function (response) {
        alert('Unfortunately there was a problem');
    },
    CLASS_NAME: "OpenLayers.Control.ChartControl"
});


