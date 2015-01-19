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



OpenLayers.Control.WmsInfoControl = OpenLayers.Class(OpenLayers.Control, {


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

    wmsLayersInfo: [],

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






        this.map.addControl(this.pan);
        this.pan.activate();

        OpenLayers.Control.prototype.activate.apply(this,arguments);



    },


    defaultIdentify: function(evt){


            this.x = evt.xy.x;
            this.y = evt.xy.y;
            this.lonlat = this.map.getLonLatFromViewPortPx(evt.xy);
            this.runIdentify();
           
 



    },

     runIdentify: function() {


            //wmsLayersInfo
            var lyr = this.map.getLayersByName(this.wmsLayersInfo[0].name)[0];
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


            var showDialogWindowInfo = this.showDialogWindowInfo;

            $.ajax({
                    url: "http://127.0.0.1:8000/jsonp",
                    // The name of the callback parameter, as specified by the YQL service
                    jsonp: "callback",
                    // Tell jQuery we're expecting JSONP
                    dataType: "jsonp",
                    // Tell YQL what we want and that we want JSON
                    data: {
		            url: url,
		            format: "json"
                    },
		    success: showDialogWindowInfo

            });
           

     },



  	/* ---------------------------------------*/





    showDialogWindowInfo: function(data) {



        var $dialog = $('#wms_dialog_window');
	    $dialog.html(data.html)
                     .dialog({
                              autoOpen: false,
                              modal: true,
                              height: 400,
                              width: 500,
                              modal: false,
                              title: 'FWI'
                     });

            
            $dialog.dialog('open');


    },





    /*  --------------------CLASS NAME -------------------*/

    CLASS_NAME: "OpenLayers.Control.WmsInfoControl"

    /* --------------------------------------------------------------------------------*/


});