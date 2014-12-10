OpenLayers.Control.InfoMarkerControl = OpenLayers.Class(OpenLayers.Control, {


    /* ----------------PROPRIERTIES--------------- */


    layerList: [],
    info_features_list: [],
    marker_layer : null,
    marker_feature : null,
    current_marker_id: null,
    mousewheel_result_function: null,
    previous_feature_id: null,

    defaultHandlerOptions: {
        'single': true,
        'double': true,
        'pixelTolerance': 0,
        'stopSingle': false,
        'stopDouble': false
    },

    lonlat: null,
    x: null,
    y: null,
    popup: null,
    vectorgeojson: null,
    selectC: null,
    loadingpanel: null,
    mouse: null,
    pan: null,
    index: 0,
    layerfound: false,



    /* ----------------INITIALIZE METODO COSTRUTTORE DELL'OGGETTO --------------- */


    initialize: function (options) {



        this.pan = new OpenLayers.Control.DragPan();
        this.handlerOptionsClick = OpenLayers.Util.extend(
            {}, this.defaultHandlerOptions
        );

        this.handler = new OpenLayers.Handler.Click(
            this, {
                'click': this.defaultIdentify,
                'dblclick': this.doubleClick
            }, this.handlerOptionsClick
        );

        OpenLayers.Util.extend(this, {
            draw: function () {


                this.mouse = new OpenLayers.Handler.MouseWheel(this, {"up": this.mouseUp, "down": this.mouseDown});


            }
        });

        this.handlers = {};
        OpenLayers.Control.prototype.initialize.apply(this, arguments);

    },


    mouseUp: function (event) {

        this.map.zoomIn();
        event.stopImmediatePropagation();

    },

    mouseDown: function (event) {

        this.map.zoomOut();
        event.stopImmediatePropagation();

    },

    doubleClick: function (evt) {

        this.lonlat = this.map.getLonLatFromViewPortPx(evt.xy);
        this.map.setCenter(this.lonlat, (this.map.zoom + 1));

    },

    /* ----------------DEACTIVATE--------------- */

    deactivate: function () {

        this.pan.deactivate();
        this.mouse.deactivate();
        this.map.removeControl(this.pan);

        this.map.events.un({
            "click": this.defaultIdentify,
            scope: this
        });

        this.map.div.style.cursor = "move";
        OpenLayers.Control.prototype.deactivate.apply(this, arguments);


    },

    /* ----------------DESTROY--------------- */

    destroy: function () {

        this.deactivate();
        this.map.events.un({
            "click": this.defaultIdentify,
            scope: this
        });
        this.map.div.style.cursor = "arrow";
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },

    /* ----------------ACTIVATE --------------- */

    activate: function () {



        this.mouse.activate();

        this.cursorstyle();
        this.set_query_marker_features_style();
        this.map.addControl(this.pan);
        this.pan.activate();

        OpenLayers.Control.prototype.activate.apply(this, arguments);
        $that = this;
        $('#query_info_results').delegate('.wrap_inner_table_results','mouseover', function() {

                    $that.unbind_bind_mousewheel_behaviour_on_hover_element(this);

        })


    },


    defaultIdentify: function (evt) {

        this.x = evt.xy.x;
        this.y = evt.xy.y;
        this.lonlat = this.map.getLonLatFromViewPortPx(evt.xy);
        this.lon = this.lonlat.lon;
        this.lat =  this.lonlat.lat;
        this.cursorstyle();

        this.map.div.style.cursor = "wait";
        this.runIdentify();
        this.map.div.style.cursor = "help";


    },




    set_query_marker_features_style : function() {


        var marker_filter_rule = new OpenLayers.Rule({

                filter: new OpenLayers.Filter.Comparison({

                        type: OpenLayers.Filter.Comparison.LIKE,
                        property: 'current',
                        value: true


                }),

                symbolizer: {

                               'externalGraphic':'/static/template_map_viewer/images/marker-info_with_shadow.png',
                               'graphicWidth': 31,
                               'fillOpacity': 1

                }
        });
        var style = new OpenLayers.Style();
        style.addRules([marker_filter_rule]);
        this.marker_layer.styleMap = new OpenLayers.StyleMap({

            'default': style

        })




    },

    cursorstyle: function () {


         this.map.div.style.cursor = "help";

    },


    addQueryMarkerToMap: function(behaviour) {

        /*
        *   behaviour: type string| values : 'one','all'
        *
        *                           'one': this.marker_layer hold only one feature;
                                    'all': every click create a new feature
        *
        *
        */

        if ((behaviour == 'one') && (this.marker_feature)) {this.marker_feature.destroy()}

        this.marker_feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(this.lon,this.lat))
        this.info_features_list.push(this.marker_feature);
        this.marker_feature.attributes.current = true;
        this.marker_layer.addFeatures(this.marker_feature);

        return this.marker_feature.id




    },


    removeInfoFeatures : function (){


        this.info_features_list.forEach(function(feat) {

            feat.destroy();


        })

        this.current_marker_id = null;


    },

    getInfoForSingleLayerBaseOnPoint : function (layer,x,y) {

        var old_LayerList = this.layerList;
        if (layer && x && y ) {

            this.x = x;
            this.y = y;
            var pixel = new OpenLayers.Pixel(x,y)
            this.lonlat = this.map.getLonLatFromViewPortPx(pixel);
            this.lon = this.lonlat.lon;
            this.lat =  this.lonlat.lat;
            this.layerList = [layer]
            this.runIdentify()

        }

        this.layerList = old_LayerList;



    },

    runIdentify: function () {



       var visible = false;


        if (this.layerList.length == 0) {

            var html = '<h1> Please add a Layer</h1>';
            $('#queryinfo #info_html').html(html);
            $('#queryinfo').slideDown(800)
            return;

        }

        if (this.current_marker_id) {

            this.show_hide_marker(this.current_marker_id,false);

        }

        this.current_marker_id = this.addQueryMarkerToMap('all');

        this.show_hide_marker(this.current_marker_id,true);
        $that = this;
        this.layerList.forEach(function(lyr) {


                if (lyr.visibility){

                    visible = true;


                    var url = lyr.getFullRequestString({
                        REQUEST: "GetFeatureInfo",
                        EXCEPTIONS: "application/vnd.ogc.se_xml",
                        BBOX: $that.map.getExtent().toBBOX(),
                        X: $that.x,
                        Y: $that.y,
                        LAYERS: lyr.params.LAYERS,
                        INFO_FORMAT: 'text/html',
                        QUERY_LAYERS: lyr.params.LAYERS,
                        WIDTH: $that.map.size.w,
                        HEIGHT: $that.map.size.h,
                        SRS: lyr.params.SRS
                    });


                    OpenLayers.Request.GET({url: url,

                                            success:(function(feature_id) {

                                                             return function(response) {

                                                                            $that.FeatureSelect(response,feature_id)

                                                                       }
                                                     })
                                                     ($that.current_marker_id)


                    })
                }


        })


    },


    show_hide_marker: function(feature_id,show){
        var feature = this.marker_layer.getFeatureById(feature_id);
        if (show) {

                    feature.attributes.current = true;
                    this.marker_layer.redraw();

        }

        else {

                feature.attributes.current = false;
                this.marker_layer.redraw();

        }

    },


    /* ---------------------------------------*/


    FeatureSelect: function(response, feature_id) {


        var selectedFeatureInfo = response.responseText;
        var info_body='';
        var html = '<div marker_id="'+feature_id+'" class="wrap_outer_table_results '+feature_id+'"><div class="wrap_inner_table_results">';


        if (selectedFeatureInfo.length > 0) {



                html+= selectedFeatureInfo;


        }

        else {


            html+= '<div id="info-results" style="min-height:50px"><strong> No feature found !!!! </strong> </div>';

        }

        html+= '</div></div>';

        $that =  this;



        /* ----------------------------- */



        this.addInfoResults([html]);

          /* events on mouseover on mouseout   */


        $('.'+feature_id).on('mouseover', function(){
                $(this).find('div.mCSB_draggerContainer').show();
                $that.show_hide_marker($(this).attr('marker_id'),true);


        }).on('mouseout', function(){

                $(this).find('div.mCSB_draggerContainer').hide();

                $that.show_hide_marker($(this).attr('marker_id'),false);
        });

        $('.wrap_inner_table_results').mCustomScrollbar();

        $('.'+feature_id+' .mCSB_draggerContainer').hide();




        this.show_hide_marker(feature_id,false);


    },

    onFeatureUnselect: function (feature) {
        selectedFeature = feature.feature;

    },

    showLoadImage: function () {

        this.loadingpanel = new OpenLayers.Control.LoadingPanel();
        this.map.addControl(this.loadingpanel);

    },


    hideLoadImage: function () {

        this.map.removeControl(this.loadingpanel);

    },
    addLayer: function (layer) {

        this.layerList.push(layer);
    },
    removeFromList: function (layer) {

        this.layerList.splice(this.layerList.indexOf(layer), 1);


    },

    unbind_bind_mousewheel_behaviour_on_hover_element: function(element){


        $that = this;




        //if ($(element).children().height() > 150 ) {

        if ($('.wrap_inner_table_results table').height() > 150 ) {



            $('#query_info_results').unmousewheel($that.mousewheel_result_function);

        }

        else {

            $('#query_info_results').mousewheel($that.mousewheel_result_function);
        }


    },


    /*  --------------------CLASS NAME PROPRIERTY -------------------*/

    CLASS_NAME: "OpenLayers.Control.InfoMarkerControl"

    /* --------------------------------------------------------------------------------*/

});

