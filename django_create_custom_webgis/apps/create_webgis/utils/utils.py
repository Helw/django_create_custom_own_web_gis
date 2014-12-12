__author__ = 'v-user'

import zipfile
import tempfile
import shutil
import os
from django.template.loader import render_to_string



OUTPUT_PACKAGE_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)),'templates','ouput_package');


def create_web_gis_zip_file(cleaned_data={'baselayers':['openstreetmap']}):
    baselayers = 'map.addLayers(['
    for bl in cleaned_data['baselayers']:
        baselayers += 'BASELAYERS["'+bl+'"]' + ','
    baselayers+=']);\n'
    template = render_to_string('webgis_templates_files/index.html',{})
    webgismap_js = render_to_string('webgis_templates_files/js/webgismap.js',{'baselayers': baselayers})
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
    shutil.copy(temp_name, '/home/v-user/testwebgis.zip')
    return temp_file