function createCustomWebGis(csrfmiddlewaretoken) {

    var baselayers = [];
    var get_all_base_layers_added = $('#added_basemap > div');
    $.each(get_all_base_layers_added, function(index,element){


            baselayers.push($(element).attr('id'))


    })


     $.download("/create/", ['baselayers','csrfmiddlewaretoken'],[baselayers.join(';'),csrfmiddlewaretoken])

//    $.post( "/create/", { baselayers: baselayers.join(';'), csrfmiddlewaretoken: csrfmiddlewaretoken }, function(data) {
//
////            blob=new Blob([data]);
////            var link=document.createElement('a');
////            link.href=window.URL.createObjectURL(blob);
////            link.download="Dossier_"+new Date()+".zip";
////            link.click();
//
//                pippo = data;
//
//
//        })




}
