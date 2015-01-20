function add_wmslayer_to_wms_div(elem) {

                var choose_layer = $(elem).attr('id');
                selected_layer = _CustomWebGis.LAYERS.wmsLayers[choose_layer];
                _CustomWebGis.buildLayer(selected_layer).addLayersToMap();
                $(elem).off('click');
                $(elem).detach().appendTo('#added_wmsLayers')


}


$('#wmsLayers > div:not(".carousel")').on('click',function () {

                        add_wmslayer_to_wms_div(this);

});


$('#wmsLayers').delegate('div:not(".carousel")','click', function (){

                add_wmslayer_to_wms_div(this);

})

$('#added_wmsLayers').delegate('div','click', function (){

                var choose_layer = $(this).attr('id');
                var layer_name = _CustomWebGis.LAYERS.wmsLayers[choose_layer].name;
                _CustomWebGis.removeLayerFromMap(layer_name);
                $(this).off('click');
                $(this).detach().appendTo('#wmsLayers')


})
