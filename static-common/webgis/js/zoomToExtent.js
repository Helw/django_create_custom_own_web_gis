OpenLayers.Control.ZoomToExtent=OpenLayers.Class(OpenLayers.Control,{type:OpenLayers.Control.TYPE_BUTTON,extent:null,initialize:function(options){this.handlers={};OpenLayers.Control.prototype.initialize.apply(this,arguments);},trigger:function(){if(this.map){this.map.zoomToExtent(this.extent);}},CLASS_NAME:"OpenLayers.Control.ZoomToExtent"});
