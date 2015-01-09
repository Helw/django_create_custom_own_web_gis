$.download = function(url, key_array, data_array){
    // Build a form
    var form = $('<form></form>').attr('action', url).attr('method', 'post');
    // Add the one key/value
    $.each(key_array, function(index, element) {

        form.append($("<input></input>").attr('type', 'hidden').attr('name', element).attr('value', data_array[index]));

        }
    )

    //send request
    form.appendTo('body').submit().remove();
};