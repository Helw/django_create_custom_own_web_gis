function createCustomWebGis(csrfmiddlewaretoken) {

    var baselayers = [];
    var wmslayers = [];
    var get_all_base_layers_added = $('#added_baseLayers > div');
    var get_all_wms_layers_added = $('#added_wmsLayers > div');
    $.each(get_all_base_layers_added, function(index,element){


            baselayers.push($(element).attr('id'))


    })

     $.each(get_all_wms_layers_added, function(index,element){


            wmslayers.push($(element).attr('id'))


    })


     $.download("/create/", ['baselayers','wmslayers','csrfmiddlewaretoken'],
                            [baselayers.join(';'), wmslayers.join(';'),csrfmiddlewaretoken]
     )

}