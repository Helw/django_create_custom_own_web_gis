from django.shortcuts import render

# Create your views here.
from django.views.generic import FormView, View, TemplateView
from .forms import BaseLayerForm
from .utils.utils import create_web_gis_zip_file
from django.core.servers.basehttp import FileWrapper
from django.http import HttpResponse
from .forms import UserLayerDataForm
import tempfile
from django_create_custom_webgis import settings
import json
import os
class BuildYourWebGisMainPage(TemplateView):

    template_name = 'webmapgis.html'



class TestEchoPostForm(View):



    def post(self, request, *args, **kwargs):

        if request.is_ajax():
            form = UserLayerDataForm(request.POST,request.FILES)
            #return HttpResponse(str(request.FILES['userlayer']))
            if form.is_valid():
                uploaded_file = form.cleaned_data.get('userlayer')

                #return HttpResponse(str(uploaded_file.read()))
                temp = tempfile.NamedTemporaryFile(dir=settings.MEDIA_ROOT)
                t_name = temp.name
                temp.seek(0)
                temp.write(uploaded_file.read())
                response_data = {}
                response_data['name'] = str(t_name)
                response_data['url'] = str(os.path.join(settings.MEDIA_URLS,t_name))
                return HttpResponse('/media/'+str(t_name.split('/')[-1]))
                #return HttpResponse(json.dumps(response_data), content_type="application/json")
            else:
                return HttpResponse(str(form.errors))



class CreateOutputWebGis(View):

    form_class = BaseLayerForm

    def post(self, request, *args, **kwargs):

        form = self.form_class(request.POST)

        if form.is_valid():
            temp = create_web_gis_zip_file(form.cleaned_data)
            wrapper = FileWrapper(temp)
            response = HttpResponse(wrapper, content_type='application/zip')
            response['Content-Disposition'] = 'attachment; filename=customwebgis'+temp.name+'.zip'
            response['Content-Length'] = temp.tell()
            #temp.seek(0)
            #temp.close()
            return response

        else:
            response_data = {}
            response_data['url'] = request.POST
            return HttpResponse(json.dumps(response_data), content_type="application/json")



def temporary_file_download(self,temporary_file):

    return HttpResponse('ciao')

