__author__ = 'v-user'

import zipfile
import tempfile

import os
from django.template.loader import render_to_string

OUTPUT_PACKAGE_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)),'templates','ouput_package');


def validation_user_layer_uploaded(layer):

    return True



def create_web_gis_zip_file(cleaned_data={'baselayers':[],'wmslayers':[]}):

    # BASELAYERS

    baselayers = 'map.addLayers(['
    for bl in cleaned_data['baselayers']:
        baselayers += 'BASELAYERS["'+bl+'"]' + ','
    baselayers+=']);\n'

    #WMS LAYERS

    wmslayers = 'map.addLayers(['
    for wl in cleaned_data['wmslayers']:
        wmslayers += 'WMSLAYERS["'+wl+'"]' + ','
    wmslayers+=']);\n'



    template = render_to_string('webgis_templates_files/index.html',{})
    webgismap_js = render_to_string('webgis_templates_files/js/webgismap.js',{'baselayers': baselayers,
                                                                              'wmslayers': wmslayers})
    temp_file = tempfile.NamedTemporaryFile()
    temp_name = temp_file.name

    with zipfile.ZipFile(temp_name, 'w', zipfile.ZIP_DEFLATED) as local_file_zip:
        rootlen = len(OUTPUT_PACKAGE_FOLDER) + 1
        local_file_zip.writestr('index.html',template)
        local_file_zip.writestr('static/js/webgismap.js',webgismap_js)
        for base, dirs, files in os.walk(OUTPUT_PACKAGE_FOLDER):
            for file in files:
                fn = os.path.join(base, file)
                local_file_zip.write(fn, fn[rootlen:])
    return temp_file