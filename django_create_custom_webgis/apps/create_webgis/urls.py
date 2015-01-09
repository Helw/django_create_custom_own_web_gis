__author__ = 'v-user'

from django.conf.urls import patterns, url

from .views import CreateOutputWebGis, temporary_file_download

urlpatterns = patterns('',

    url(r'^$', CreateOutputWebGis.as_view(), name='create'),
    url(r'^tempfile/(?P<temporary_file>\w+)/$',temporary_file_download, name='temporary_file'),

)

