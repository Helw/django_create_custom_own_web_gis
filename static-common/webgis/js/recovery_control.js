/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control.js
 */

/**
 * Class: OpenLayers.Control.Identify
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */

OpenLayers.Control.FireRec = OpenLayers.Class(OpenLayers.Control, {


    /* ----------------PROPRIERTIES--------------- */


    defaultHandlerOptions: {
                    'single': true,
                    'double': true,
                    'pixelTolerance': 0,
                    'stopSingle': false,
                    'stopDouble': false
                },

	
	lonlat:null,
	
	x:null,
	
	y:null,

    popup:null,

    vectorgeojson : null,

    selectC : null,

   loadingpanel: null,

   mouse: null,

   pan: null,





    /* ----------------INITIALIZE METODO COSTRUTTORE DELL'OGGETTO --------------- */


    initialize: function(options) {


             this.pan = new OpenLayers.Control.DragPan();

             this.handlerOptionsClick = OpenLayers.Util.extend(
                        {},this.defaultHandlerOptions
                    );
			 OpenLayers.Control.prototype.initialize.apply(this, arguments);

			 this.handler = new OpenLayers.Handler.Click(
                                        this, {
                                                'click': this.defaultIdentify,
                                                'dblclick': this.doubleClick
                                               }, this.handlerOptionsClick
                                )

             OpenLayers.Util.extend(this, {
                            draw: function () {
                                        this.mouse= new OpenLayers.Handler.MouseWheel(this, {"up":
                                        this.mouseUp, "down": this.mouseDown});
                                        this.mouse.activate();

              }});







	},


	mouseUp : function(event) {



                        this.map.zoomIn();
                        event.stopImmediatePropagation();

	},

	mouseDown : function(event) {


	                    this.map.zoomOut();
	                    event.stopImmediatePropagation();

	},

	doubleClick: function(evt){


        this.lonlat = this.map.getLonLatFromViewPortPx(evt.xy);
        this.map.setCenter(this.lonlat,(this.map.zoom + 1));

	},


    /* ---------------------------------------*/




     /* ----------------DEACTIVATE--------------- */

    deactivate: function() {


         this.pan.deactivate();
         this.map.removeControl(this.pan);
         this.map.events.un({
              "click": this.defaultIdentify,
              scope: this
        });

		this.map.div.style.cursor = "move";

       OpenLayers.Control.prototype.deactivate.apply(this, arguments);
       changeIcon();
    },

     /* ---------------------------------------*/


    /* ----------------DESTROY--------------- */

	destroy: function() {


		this.deactivate();

		this.map.events.un({
              "click": this.defaultIdentify,
              scope: this
        });

		this.map.div.style.cursor = "arrow";
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },


    /* ---------------------------------------*/



    /* ----------------ACTIVATE --------------- */


    activate: function() {




        this.cursorstyle();

        this.map.addControl(this.pan);
        this.pan.activate();

        OpenLayers.Control.prototype.activate.apply(this,arguments);

        changeIcon();



    },


    defaultIdentify: function(evt){




            this.x = evt.xy.x;
            this.y = evt.xy.y;
            this.lonlat = this.map.getLonLatFromViewPortPx(evt.xy);




            this.map.div.style.cursor;



            if (this.map.zoom < 8) {

                var pixel= new OpenLayers.Pixel(this.x, this.y);
                this.lonlat = this.map.getLonLatFromPixel(pixel);
                this.map.setCenter(this.lonlat,8);
                this.cursorstyle();

                OpenLayers.Event.stop(evt);

            }

            else {

                this.cursorstyle();
                this.runIdentify();
                OpenLayers.Event.stop(evt);
            }



    },

    cursorstyle: function() {

            if (this.map.zoom > 7) {

                this.map.div.style.cursor = "help";



            }

            else {

                this.map.div.style.cursor = "crosshair";


            }


    },



     runIdentify: function() {



            var lyr = this.map.getLayersByName("reba_wms")[0];
            var url =  lyr.getFullRequestString({
		             		REQUEST: "GetFeatureInfo",
		            		 EXCEPTIONS: "application/vnd.ogc.se_xml",
		            		 BBOX: this.map.getExtent().toBBOX(),
		            		 X:  this.x,
		            		 Y: this.y,
		            		 LAYERS:  lyr.params.LAYERS,
		            		 INFO_FORMAT: 'text/html',
		            		 QUERY_LAYERS:  lyr.params.LAYERS,
		            		 WIDTH: this.map.size.w,
		            		HEIGHT: this.map.size.h,
		            		SRS:  lyr.params.SRS})


            this.map.div.style.cursor = "wait";

            var req = OpenLayers.Request.GET({url:url,success:this.FeatureSelect,scope:this});

     },



  	/* ---------------------------------------*/





    FeatureSelect: function(response) {



            var $dialog =  $('#dialog_boxplot')

            var selectedFeature = response.responseText;


            if (selectedFeature.length > 0) {
                var selectedFeatureId = selectedFeature.split(';')[0];
                var selectedFeaturePlace = selectedFeature.split(';')[1];
                var selectedFeatureArea = selectedFeature.split(';')[2];
                var selectedFeatureYear = selectedFeature.split(';')[3];


                var page =  selectedFeatureId;
                $dialog.html('<iframe id="bboxplot" style="border: 0px; " src="' + page + '" width="100%" height="100%"></iframe>')
                $dialog.dialog({
                                              autoOpen: false,
                                              modal: true,
                                              height: 650,
                                              width: 970,
                                              modal: false,
                                              title: selectedFeaturePlace + " - " + selectedFeatureYear + " - " + selectedFeatureArea + " ha"
                                        });




            }

            else {

                     $dialog.html('<h1> No feature selected </h1>')
                     .dialog({
                              autoOpen: false,
                              modal: true,
                              height: 200,
                              width: 300,
                              modal: false,
                              title: 'No Feature'
                     });

            }

             this.map.div.style.cursor = "help";
             $dialog.dialog('open');


    },

    onFeatureUnselect: function (feature) {
            selectedFeature = feature.feature;

    },

    showLoadImage: function(){

        this.loadingpanel = new OpenLayers.Control.LoadingPanel();

        this.map.addControl(this.loadingpanel);

    },


    hideLoadImage: function(){

        this.map.removeControl(this.loadingpanel);

    },




    /*  --------------------PROPRIETA' FINALE DELL'OGGETTO CLASSE -------------------*/

    CLASS_NAME: "OpenLayers.Control.FireRec"

    /* --------------------------------------------------------------------------------*/


});
