function createCustomWebGis(csrfmiddlewaretoken) {

    var html_form = '<form id="downloadcustomzip" action="/create/" style="display:none">'
    html_form+='<input type="text" name='openstreetmap' value="Hello there"></form>'



    $.post( "/create/", { name: "openstreetmap", csrfmiddlewaretoken: csrfmiddlewaretoken }, function(data) {


            WinId = window.open('', 'newwin', 'width=400,height=500');
            WinId.document.write(data);
            WinId.document.close();
            //window.open(data)
            //alert(data)


        })







}
