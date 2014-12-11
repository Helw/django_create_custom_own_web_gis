/*PROXY */

//OpenLayers.ProxyHost = "/proxy/?url=";

/* -------- */




/*OpenLayers.Util.onImageLoadError = function () {

    var url_params = OpenLayers.Util.getParameters(this.src);
    var layer_fail = url_params.LAYERS

}*/




function WebGisMap(map_type,new_types) {





    /*************STATIC ATTRIBUTES **************************
     *                                                        *
     * Check if a previous instance of Map_Object_Constructor *
     * was built.                                             *
     *                                                        *
     *********************************************************/



    WebGisMap.instance = WebGisMap.instance || new Map_Object_Constructor();

    return WebGisMap.instance;


    /*  -------- PRIVATE ATTRIBUTES  ------------ */


    var panel;
    var helptext;





    /* ------------------------------------------- */


    /* --------PRIVATE METHODS ------------------ */


    function checkLegend() {


        var $outer_legend = $('#wrap-outer-legend');
        $outer_legend.mCustomScrollbar();
        $('#legend_icon').click(function () {
            $outer_legend.toggle('slide', { direction: "right" }, 600);
        });

        if ($outer_legend.is(":visible")) {
            $('#legend_icon').show();

        }

       return $outer_legend;


    };


    function parseXml(xml) {
            $("#location-results").html('<br />');
            var searchtext = $("#googlemaps_search").val();
            //for each service (Google, Yahoo, Geonames...)
            $(xml).find("service").each(function () {
                var service_name = $(this).attr("name");
                $("#location-results").append('<strong class="location-results-body">Results for "' + searchtext + '" from ' + service_name + "</strong>:<br />");
                $(this).find("location").each(function () {
                    var loc_name = $(this).attr("name");
                    var lon = $(this).attr("lon");
                    var lat = $(this).attr("lat");
                    var html_location = '<a class="location-results-body" lon='+ lon +' lat='+ lat +' href="">' + loc_name + '</a>';
                    $("#location-results").append(html_location + "<br />");
                });
                $("#location-results").append('<br />');
            });
    };

    /* ------------------------------------------- */


    /*  ***************  FUNCTION CONSTRUCTOR  **************
     *                                                       *
     *  Map_Object_Constructor build the SINGLETON instance  *
     *                                                       *
     ********************************************************/


    function Map_Object_Constructor() {

         /*****************TYPE OF MAP ****************
        *                                            *
        *                                            *
        *                                            *
        **********************************************/


        var type = {

            iframe : {minZoomLevel:3,
                      Bounds:new OpenLayers.Bounds(-3997819.4816408, 3978863.2533342, 7429821.9935154, 11561416.458168)
                     },
            global : {minZoomLevel:0,
                      Bounds:new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34)
                     },
            europe:  {minZoomLevel:4,
                     Bounds:new OpenLayers.Bounds(-7989667.0196601, 3191256.7073397, 10795497.04909, 11546741.142086)
                     },
            custom:{} //example new custom key extend

        }


        /* if a second arguments is passed, we can extend type object extend */

        type = $.extend(type,new_types)

        var map_settings = (map_type !== undefined) ? type[map_type] : type['global'] ;

        var layer_id_list = [];

        /* --------PUBLIC ATTRIBUTES ------------------ */

        this.appControl = [];

        this.BindControlsLayers = {};

        this.arrayLayers = [];

        this.countWmsLayers = 0;

        this.infoDiv = $('#query_info_results');

        this.layer;

        this.initial_bounds = map_settings.Bounds;


        this.AppMethods = {};

        this.AppAttributes = {};

        /* ------------------------------------------- */

        /* --------PUBLIC METHODS ------------------ */


        this.help = function (name) {

            if (arguments.length == 0 || arguments.length > 1 || arguments[0] !== 'string') {


                console.log('Please insert the name of the function/method as string : Example help("addControlsToMap")');
                return;

            }

            console.log(this[name].help);

        }


        /* Return the Index and the Layer based on layer Name */

        this.get_layer_index = function (layer_name) {


            var layer = this.map.getLayersByName(layer_name)[0];
            var index = this.map.getLayerIndex(layer);
            return [layer, index];


        };


        this.Controls = {


             zAll : new OpenLayers.Control.ZoomToExtent({extent: this.initial_bounds}),
             navigation : new OpenLayers.Control.Navigation(
                                {
                                    title: 'You can use the default mouse configuration',
                                    type: OpenLayers.Control.TYPE_TOOL
                                }
                          ),
             zoom_box : new OpenLayers.Control.ZoomBox(
                                        {
                                           title: "Zoom box: Selecting it you can zoom on an area by clicking and dragging.",
                                           type: OpenLayers.Control.TYPE_TOO
                                        }),

            navigationHistory : new OpenLayers.Control.NavigationHistory(
                                        {
                                                "previousOptions": {"title": "Navigation history ( <-- Back)"}
                                        }

                                ),
            permalink : new OpenLayers.Control.Permalink(),

            scalebar : new OpenLayers.Control.ScaleLine(),

            mouse_position : new OpenLayers.Control.MousePosition({numDigits:4}),

            zoom :  new OpenLayers.Control.Zoom(),

            panzoom : new OpenLayers.Control.PanZoomBar(),
            layerswitcher : new OpenLayers.Control.LayerSwitcher()


        };

        this.Panel = new OpenLayers.Control.Panel({});


        this.addControlsToMap = function (controls) {

            this.appControl = controls;

            if (controls.length > 0) {

                panel.addControls(controls);
            }

        };

        this.removeLayerFromLayerSwitch = function () {

            /* Put code here */

        };


        this.removeLayerFromMap = function (layer_name) {

            var layer = this.get_layer_index(layer_name)[0];
            layer.destroy();
            return this;



        };


        /*Return WMS parameter based on layer name and parameter name*/

        this.getWmsLayerParameter = function (layer_name, param) {

            var parval = this.getLayerByName(layer_name) ? this.getLayerByName(layer_name).params[param.toUpperCase()] : undefined;
            return parval;

        };


        /* Temporary reference "this.addLayerToLayerSwitch" to "this.addLayerToPanel" fucntion */


        this.addLayerToLayerSwitch = this.addLayerToPanel;


        /* ------------- */




        /* ADD INFO RESULTS */


        this.addInfoResults = function (html) {

            var $info = $('#query_info_results');
            var $wrap_info = $('#wrap_query_info_results');


            html.forEach(function(element){

                $wrap = $('<div class="horizontal_alignment">');

                $wrap.append(element);

                $info.prepend($wrap);

            })
            if (!$wrap_info.is(':visible')){
                $wrap_info.slideToggle(600);
                $('#chart_div').removeClass();
                $('#chart_div').toggleClass('chart_div_above_full_info');
            };

            if (!$info.is(':visible')){
                $info.slideToggle(600);
                $('#hide_query_results').show();
                $('#show_query_results').hide();

            };






            return this;


        }


        /*---------------*/

        this.addLayerToPanel = function (layer_name, background_image) {

            var layer_index = this.get_layer_index(layer_name);
            var layer = layer_index[0];
            var index = layer_index[1];
            var bk_img;

            if (!background_image) {


                switch (layer_name) {

                    case 'Google Physical':


                        bk_img = "background-image:url('/static/template_map_viewer/images/gtr.png')";
                        break;

                    case 'Google Hybrid':

                        bk_img = "background-image:url('/static/template_map_viewer/images/ghy.png')";
                        break;

                    case 'Google Satellite':

                        bk_img = "background-image:url('/static/template_map_viewer/images/gsat.png')";
                        break;

                    case 'OpenStreetMap':

                        bk_img = "background-image:url('/static/template_map_viewer/images/osm.png')";
                        break;


                    default:

                        bk_img = "background-image:url('/static/template_map_viewer/images/generic_layer.png')";

                }

            }
            else {


                bk_img = "background-image:url('"+background_image+"')";

            }


            /* -- Insert the right order of the layer - Last insert First after OSM layer --*/

            if (index < 4) {
                $('#layer_list').append('<div class="layers" id="layer_' + index + '" style=' + bk_img + '> ' + layer.name + '</div>');
            }
            else {


                $('<div class="layers" id="layer_' + index + '" style=' + bk_img + '> ' + layer.name + '</div>').insertAfter($('#layer_3'));
            }

            $this = this;



            $('#layer_' + index + '').click(function (evt) {


                if (layer.isBaseLayer) {

                    if (!layer.getVisibility()) {

                        $('#layer_list div#layer_0,div#layer_1,div#layer_2,div#layer_3').removeClass('layers_visible');
                        $(this).toggleClass('layers_visible');
                        $this.map.setBaseLayer(layer);

                    }

                }

                else {


                    layer.getVisibility() ? layer.setVisibility(false) : layer.setVisibility(true)
                    $(this).toggleClass('layers_visible');


                }


            })

            if (index > 2) {

                if (layer.getVisibility()) {
                    $('#layer_' + index + '').addClass('layers_visible'); //set to active layer
                }
                layer_id_list.push('#layer_' + index + '');

            }
            return this;


        };

        this.getLayerIdList = function(){


            return layer_id_list

        };



        this.resetLayerIdList = function () {



            layer_id_list = []
        };


        this.removeLayerToPanel = function (layer_name) {


            var index = this.get_layer_index(layer_name)[1];
            $('#layer_' + index + '').remove();
            return this;


        };


        this.hideShowLayerToPanel = function (layer_name) {


        };


        this.setBackgroundImageLayerPanel = function (background_image) {


        };


        this.baseLayers = {


            google_phy: new OpenLayers.Layer.Google(
                "Google Physical",
                {type: google.maps.MapTypeId.TERRAIN,
                    minZoomLevel: map_settings.minZoomLevel, maxZoomLevel: 16,
                    numZoomLevels: 16}
            ),

            google_hyb: new OpenLayers.Layer.Google(
                "Google Hybrid",
                {type: google.maps.MapTypeId.HYBRID,
                    minZoomLevel: map_settings.minZoomLevel, maxZoomLevel: 20,
                    numZoomLevels: 20}
            ),

            google_sat: new OpenLayers.Layer.Google(
                "Google Satellite",
                {
                    type: google.maps.MapTypeId.SATELLITE,

                    minZoomLevel: map_settings.minZoomLevel, maxZoomLevel: 22,
                    numZoomLevels: 22

                }
            ),

            openstreetmap: new OpenLayers.Layer.OSM(
                    "OpenStreetMap"

            )


        };




        this.proj4326 = new OpenLayers.Projection("EPSG:4326");

        this.proj900913 = new OpenLayers.Projection("EPSG:900913");

        this.map = new OpenLayers.Map('custom_map', {
            projection: this.proj900913,
            displayProjection: this.proj4326,
            maxExtent: map_settings.Bounds,
            units: 'm',
            controls: [],
            numZoomLevels: 30

        });

        this.currentBaseLayer = false;

        this.addBaseLayer = function (base_layer) {


            var layer = this.baseLayers[base_layer];

            this.map.addLayer(layer);

            if ( !(this.currentBaseLayer)) {


                this.currentBaseLayer = layer;
                this.map.addControl(this.Controls.navigation);
                this.map.zoomToMaxExtent();


            }



            else {

                this.currentBaseLayer.setVisibility(false);
                layer.setVisibility(true);
                this.currentBaseLayer = layer;
                if (this.map.layers.length == 2) {
                    this.map.addControl(this.Controls.layerswitcher);
                }

            }



        };


        this.removeBaseLayer = function (base_layer) {

            this.map.removeLayer(this.baseLayers[base_layer])


            var l = this.map.controls.length;
            var map_layers_length = this.map.layers.length;
            if (map_layers_length == 0) {

                    this.removeAllMapControls();
                    this.currentBaseLayer = false;

            }

            else if (map_layers_length == 1) {


                    this.map.removeControl(this.Controls.layerswitcher);

            }

            else {

                this.map.layers[this.map.layers.length -1].setVisibility(true);

            }

        };

        this.removeAllMapControls = function () {




                while (this.map.controls.length > 0) {


                        this.map.removeControl(this.map.controls[0]);


                }





        };




        this.getLayerByName = function (layer_name) {

            this.layer = this.get_layer_index(layer_name)[0];
            return this.layer;


        };

        this.show_layers_list = function (show) {

                if ((show) && !($('#wrap_layer_list').is(':visible'))) {

                    $('#layers').click()

                }

                return this;

        };


        this.show_left_column = function (show) {

                if (show) {

                        $('#open_left_column').click();

                }

                return this;


        };

        this.show_legend = function(show) {

            if (show) {

                $('#legend_icon').show();
                $('#wrap-outer-legend').show()


            }
            else {

                $('#legend_icon').hide()
                $('#wrap-outer-legend').hide();

            }

            return this;


        }

        this.show_find_location = function(show){

                if (show) {

                        $('#gazSearch').show();

                }
                else {

                        $('#gazSearch').hide();

                }

                return this;

        };

        /* GOOGLE SEARCH */

        this.codeAddress = function(address) {
              $this = this;
              var geocoder = new google.maps.Geocoder();
              geocoder.geocode( { 'address': address}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                   $this.map.setCenter(OpenLayers.Layer.SphericalMercator.forwardMercator(results[0].geometry.location.lng(), results[0].geometry.location.lat()), 12);
                }
              })

        };



        this.getLocations = function(searchtext) {
                //search only at least if there are 2 chars
                var xmlreq;
                if (searchtext.length > 1) {
                    if (xmlreq != undefined) {
                        xmlreq.abort();
                    }
                    ;
                    $("#location-results").html('<br /><div id="progress"><h5>Geocoding ' + searchtext + '...</h5></div>');
                    outxml = '/geolocate?address=' + searchtext;
                    xmlreq = $.ajax({
                        type: "GET",
                        data: '',
                        url: outxml,
                        dataType: "xml",
                        error: function(err){},
                        success: parseXml
                    });
                }
                else {
                    $("#location-results").html('No results.');
                }
                $("#location-results").slideDown();

                $('#close-location-results').show();
        };


        /* ------------------------------------------------------------------ */

        this.buildLayer = function(object) {


            var type = object.type || '';
            var layer_name = object.layer_name || '';
            var name = object.name || 'Layer';
            var source = object.source || '';
            var options = object.options || { buffer: 0, opacity: 1};
            var wms_parameters = object.wms_parameters || {};

            switch (type) {

                case('wms') :


                    var wmsLayerParams = {
                        layers: layer_name,
                        format: 'image/png',
                        transparent: true,
                        singleTile: false
                    };


                    var layer = new OpenLayers.Layer.WMS(name, source, wmsLayerParams, options);

                    layer.mergeNewParams(wms_parameters);
                    this.arrayLayers.push(layer);
                    this.countWmsLayers++;
                    break;

                case('vector'):


                    var layer = new OpenLayers.Layer.Vector(name, options);
                    this.arrayLayers.push(layer);
                    break;


                default:

                    console.log('Layer TYPE ' + type);


            }

            return this;
        };


        /* if no arguments is passed to the function, add all built layers to the map */


        this.addLayersToMap = function () {


            if (arguments.length == 0) {
                this.map.addLayers(this.arrayLayers);
                this.arrayLayers = []; //reset array Layers if no layer name is given
            }
            else {
                for (var i = 0; i < arguments.length; i++) {
                    for (var j = 0; j < this.arrayLayers.length; j++) {


                        if (this.arrayLayers[j].name == arguments[i]) {
                            this.map.addLayer(this.arrayLayers[j]);
                            this.arrayLayers.splice(j, 1);
                        }
                    }
                }

            }


            /* PUT COUNTRY BOUNDARY LAYER ON TOP */

            var country_bound = this.get_layer_index('Country_Boundaries')[0];
            this.map.raiseLayer(country_bound, this.map.layers.length);
            if (this.marker_vector_layer) {

                this.map.raiseLayer(this.marker_vector_layer , this.map.layers.length);

            }

            return this;

        };

        this.hasLayer = function (layer_name) {

            for (var j = 0; j < this.map.layers.length; j++) {

                if (this.map.layers[j].name == layer_name) {
                    return true;
                }
            }

            return false;
        };


        this.mousewheel_function_event_on_query_info_results = function(e, delta) {
                            this.scrollLeft -= (delta * 20);
                            e.preventDefault();
        };


        this.marker_layer_parameters =  {
                type: 'vector',
                name: 'Marker_Layer'

        };



        /* ADD INFO CONTROL */


        this.addInfoMarkerControl = function(){



            this.infoMarkerControl = new OpenLayers.Control.InfoMarkerControl();
            this.infoMarkerControl.mousewheel_result_function = this.mousewheel_function_event_on_query_info_results;
            this.infoMarkerControl.addInfoResults = this.addInfoResults; //bound addInfoResults to addInfoResults function to fill InfoDiv element
            this.marker_vector_layer = this.getLayerByName('Marker_Layer') || this.buildLayer(this.marker_layer_parameters).addLayersToMap().getLayerByName('Marker_Layer');
            this.infoMarkerControl.marker_layer = this.marker_vector_layer;
            this.addControlsToMap([this.infoMarkerControl]);
            this.BindControlsLayers.info = this.infoMarkerControl;
            return this.infoMarkerControl



        };

        /* ------------------------- */

         /* ADD CHART CONTROL */


        this.addChartMarkerControl = function(){

            this.chartMarkerControl = new OpenLayers.Control.ChartControl();
            this.chartMarkerControl.addChartResults = this.addChartResults; //bound addInfoResults to addInfoResults function to fill InfoDiv element
            this.marker_vector_layer = this.getLayerByName('Marker_Layer') || this.buildLayer(this.marker_layer_parameters).addLayersToMap().getLayerByName('Marker_Layer');
            this.chartMarkerControl.marker_layer = this.marker_vector_layer;
            this.addControlsToMap([this.chartMarkerControl]);
            this.BindControlsLayers.chart = this.chartMarkerControl;
            return this.chartMarkerControl


        };



         /* -------------- */



        this.application_attribute_methods = {} ;


        /* Run initialization Map after instance creation*/

        /*(function initializeMapApplication(object) {

            object.map.div.style.cursor = "move";



            object.map.zoomToExtent(object.initial_bounds);




            for (var i = 0; i < (object.map.layers.length - 1); i++) {


                object.addLayerToPanel(object.map.layers[i].name);

            }
            $('#layer_0').addClass('layers_visible'); //set the first google layer as selected

            $('#searchTab a').click(function (e) {
                e.preventDefault()
                $(this).tab('show')
            })



            $('#pSearch').click(function(){


                object.getLocations($('#googlemaps_search').val());


            });

            $('#close-location-results').click(function(){

                $('#location-results').slideUp();
                $(this).hide();


            })

            $("#location-results").delegate('.location-results-body','click',function(e){

                e.preventDefault();
                var lon=$(this).attr('lon');
                var lat=$(this).attr('lat');

                var lonlat = new OpenLayers.LonLat(lon, lat);
                object.map.setCenter(lonlat.transform(object.proj4326, object.proj900913),9);


            })

            $('#googlemaps_search').keyup(function(e) {
                if ($.trim($(this).val()) !=''){
                    object.getLocations($(this).val());
                }
                else {

                    $("#location-results").slideUp();
                    $("#close-location-results").hide();
                }
            });


            var $show_hide_chart = $('.hide_show_chart');
            var $chart_body = $('#chart_body');
            var $chart = $('#chart_div');
            var $title_chart = $('#title_chart');
            var $close_chart = $('#close_chart');

            $show_hide_chart.click(function(evt){

                 $title_chart.hide();
                 $title_chart.toggleClass('title_chart_vertical')
                 $chart_body.toggle('slide',{ direction: 'left' }, 600).promise().done(function(){

                        $show_hide_chart.toggle().promise().done(function(){
                           $title_chart.show();
                        });

                        $close_chart.toggleClass('close_chart_vertical');


                 })




            })

            $close_chart.on('click',function() {

                $chart.toggle('slide',{ direction: 'left' }, 600).promise().done(function(){

                        $chart_body.html('');
                        object.chartMarkerControl.removeMarkerFeature();

                })
            })




            $('#query_info_results').mousewheel(this.mousewheel_function_event_on_query_info_results)
            var $info = $('#query_info_results');
            var $wrap_info = $('#wrap_query_info_results');
            var $show_hide_query_results = $('.hide_show_query_results');


            $show_hide_query_results.click(function(evt){



                 $info.slideToggle(600).promise().done(function(){



                    $show_hide_query_results.toggle();
                    $chart.removeClass();

                    if ($('#show_query_results').is(':visible')) {

                        $chart.toggleClass('chart_div_above_reduced_info');

                    }

                     else {

                        $chart.toggleClass('chart_div_above_full_info');
                     }



                 })





            })



            $('#close_query_results').click(function(){

                $wrap_info.slideToggle(600).promise().done(function(){
                            $('#hide_query_results').show();
                            $('#show_query_results').hide();
                            $('#query_info_results').html('');
                            $chart.removeClass();
                })

                object.infoMarkerControl.removeInfoFeatures();


            })




            $('#open_left_column, #closeleftcoltools').click(function (e) {

                $('#leftcoltools').toggle('slide', 600);

                $('#open_left_column').toggle();

                $('.olControlZoom').toggleClass('zoom_in_out_open_leftcolumn');

                $('#wrap_query_info_results').toggleClass('wrap_query_info_results_fullpage');

            });


            var legend = checkLegend();

            $('#layers').click(function () {

                $('#wrap_layer_list').toggle('slide', { direction: "right" }, 600);
                $('#layers_list_arrow').toggle('slide', { direction: "right" }, 600);
                legend.toggleClass('outer-legend-down', 600);

            })

            $('#fullscreen').click(function () {

                $('#maincontainer,#container').toggleClass('container');
                object.map.updateSize();

            })

            if (window['initApp']) {
                initApp(object)
            }
            ;


        })(this);

        */
        addBaseLayer(this);

    }
};

