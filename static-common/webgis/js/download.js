function createCustomWebGis(csrfmiddlewaretoken) {

    var baselayers = [];
    var get_all_base_layers_added = $('#added_basemap > div');
    $.each(get_all_base_layers_added, function(index,element){


            baselayers.push($(element).attr('id'))


    })


     $.download("/create/", ['baselayers','csrfmiddlewaretoken'],[baselayers.join(';'),csrfmiddlewaretoken])



}