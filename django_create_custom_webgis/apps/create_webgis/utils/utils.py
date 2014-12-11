__author__ = 'v-user'

import zipfile
import tempfile
import os


OUTPUT_PACKAGE_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)),'templates','ouput_package');


def create_web_gis_zip_file():

    temp_file = tempfile.NamedTemporaryFile()
    temp_name = temp_file.name

    with zipfile.ZipFile(temp_name, 'w', zipfile.ZIP_DEFLATED) as local_file_zip:
        rootlen = len(OUTPUT_PACKAGE_FOLDER) + 1
        for base, dirs, files in os.walk(OUTPUT_PACKAGE_FOLDER):
            for file in files:
                fn = os.path.join(base, file)
                local_file_zip.write(fn, fn[rootlen:])

    return temp_file