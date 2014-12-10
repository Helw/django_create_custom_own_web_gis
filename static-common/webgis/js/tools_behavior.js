var search_is_open = false;
var windows_status = false;
var placesel = false;

function open_close_search() {

    $('#leftcoltools').toggle('slide', 600);

    $('#search').toggleClass('searchpanelopen', 600);

    $('#maptools').toggleClass('searchpanelopen', 600);

    $('.olControlZoom').toggleClass('zoom_in_out_open_leftcolumn');


}


function tools_behaviors() {


    $('#searchTab a').click(function (e) {
        e.preventDefault()
        $(this).tab('show')
    })


    $('#search, #closeleftcoltools').click(function (evt) {

        open_close_search();

    });


    $('#layers').click(function () {

        $('#layer_list').toggle('slide', { direction: "right" }, 300);

    })

    $('#fullscreen').click(function () {

        $('#maincontainer,#container').toggleClass('container');
        map.updateSize()

    })


}
