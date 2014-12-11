from django.shortcuts import render

# Create your views here.
from django.views.generic import FormView, View
from .forms import BaseLayerForm
from django.shortcuts import  redirect
from .utils.utils import create_web_gis_zip_file
from django.core.servers.basehttp import FileWrapper
from django.http import HttpResponse
import json

class CreateOutputWebGis(View):

    form_class = BaseLayerForm

    def post(self, request, *args, **kwargs):

        form = self.form_class(request.POST)
        if form.is_valid():
            temp = create_web_gis_zip_file()
            wrapper = FileWrapper(temp)
            response = HttpResponse(wrapper, content_type='application/zip')
            response['Content-Disposition'] = 'attachment; filename=customwebgis'+temp.name+'.zip'
            response['Content-Length'] = temp.tell()
            temp.seek(0)
            temp.close()
            return response

        else:
            response_data = {}
            response_data['url'] = 'failed'
            return HttpResponse(json.dumps(response_data), content_type="application/json")





