function createCustomWebGis(csrfmiddlewaretoken) {



    $.post( "/create/", { name: "openstreetmap", csrfmiddlewaretoken: csrfmiddlewaretoken }, function(data) {

            alert(data);


        })







}
