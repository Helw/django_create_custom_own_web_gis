function addBaseLayer(o) {

        function basemap_function(elem) {

                var choose_layer = $(elem).attr('id');
                o.map.addLayer(o.baseLayers[choose_layer]);
                o.map.zoomToMaxExtent();
                $(elem).off('click');
                $(elem).detach().appendTo('#added_basemap')


        }

        $('#basemap > div').on('click',function () {

                $('#custom_map').text('');
                basemap_function(this);


        });


        $('#basemap').delegate('div','click', function (){


                basemap_function(this);

        })

        $('#added_basemap').delegate('div','click', function (){

                var choose_layer = $(this).attr('id');
                o.map.removeLayer(o.baseLayers[choose_layer]);
                $(this).off('click');
                $(this).detach().appendTo('#basemap')


        })


}