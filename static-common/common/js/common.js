function createCustomWebGis(csrfmiddlewaretoken) {

    var baselayers = []
    var get_all_base_layers_added = $('#added_basemap > div');
    $.each(get_all_base_layers_added, function(index,element){


            baselayers.push($(element).attr('id'))


    })


    $.post( "/create/", { baselayers: baselayers.join(';'), csrfmiddlewaretoken: csrfmiddlewaretoken }, function(data) {

            alert(data);


        })







}
