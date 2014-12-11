__author__ = 'v-user'

import zipfile
import tempfile
import shutil
import os
from django.template.loader import render_to_string


OUTPUT_PACKAGE_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)),'templates','ouput_package');


def create_web_gis_zip_file(cleaned_data={'name':'openstreetmap'}):
    template = render_to_string('index_template/index.html',{'baselayer': cleaned_data['name']})
    temp_file = tempfile.NamedTemporaryFile()
    temp_name = temp_file.name

    with zipfile.ZipFile(temp_name, 'w', zipfile.ZIP_DEFLATED) as local_file_zip:
        rootlen = len(OUTPUT_PACKAGE_FOLDER) + 1
        local_file_zip.writestr('index.html',template)
        for base, dirs, files in os.walk(OUTPUT_PACKAGE_FOLDER):
            for file in files:
                fn = os.path.join(base, file)
                local_file_zip.write(fn, fn[rootlen:])
    shutil.copy(temp_name, '/home/francesco/testwebgis.zip')
    return temp_file