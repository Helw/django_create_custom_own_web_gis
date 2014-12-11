function addBaseLayer(o) {

        function add_baselayer_to_basemap_div(elem) {

                var choose_layer = $(elem).attr('id');
                o.addBaseLayer(choose_layer);
                $(elem).off('click');
                $(elem).detach().appendTo('#added_basemap')


        }

        $('#basemap > div').on('click',function () {

                        add_baselayer_to_basemap_div(this);


        });


        $('#basemap').delegate('div','click', function (){

                add_baselayer_to_basemap_div(this);

        })

        $('#added_basemap').delegate('div','click', function (){

                var choose_layer = $(this).attr('id');
                o.removeBaseLayer(choose_layer);
                $(this).off('click');
                $(this).detach().appendTo('#basemap')


        })


}

