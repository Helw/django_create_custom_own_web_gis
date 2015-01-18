__author__ = 'v-user'

from django.conf.urls import patterns, url

from .views import json_proxy

urlpatterns = patterns('',

    url(r'^$',json_proxy, name='json_api'),

)

