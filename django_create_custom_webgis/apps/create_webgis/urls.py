__author__ = 'v-user'

from django.conf.urls import patterns, url

from django.views.generic import TemplateView
from .views import CreateOutputWebGis#, CreateFormValidatorWebGis

urlpatterns = patterns('',

    url(r'^$', CreateOutputWebGis.as_view(), name='create'),
    #url(r'^$', CreateOutputWebGis.as_view(), name='create'),


)

