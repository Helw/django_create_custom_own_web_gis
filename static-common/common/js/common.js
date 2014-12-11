function createCustomWebGis(csrfmiddlewaretoken) {


    $.post( "/create/", { name: "openstreetmap", csrfmiddlewaretoken: csrfmiddlewaretoken } )




}
