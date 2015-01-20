

function add_baselayer_to_basemap_div(elem) {

                var choose_layer = $(elem).attr('id');
                _CustomWebGis.addBaseLayer(choose_layer);
                $(elem).off('click');
                $(elem).detach().appendTo('#added_baseLayers')


}


$('#baseLayers > div:not(".carousel")').on('click',function () {
                        alert('pigiato')
                        add_baselayer_to_basemap_div(this);

});


$('#baseLayers').delegate('div:not(".carousel")','click', function (){

                add_baselayer_to_basemap_div(this);

})

$('#added_baseLayers').delegate('div','click', function (){

                var choose_layer = $(this).attr('id');
                _CustomWebGis.removeBaseLayer(choose_layer);
                $(this).off('click');
                $(this).detach().appendTo('#baseLayers')


})


