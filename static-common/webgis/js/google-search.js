
function codeAddress(selector) {
  geocoder = new google.maps.Geocoder();
  var address = $('#'+selector).val();
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
       map.setCenter(OpenLayers.Layer.SphericalMercator.forwardMercator(results[0].geometry.location.lng(), results[0].geometry.location.lat()), 12);
    } 
  });
}
