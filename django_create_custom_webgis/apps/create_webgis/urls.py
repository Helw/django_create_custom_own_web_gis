__author__ = 'v-user'

from django.conf.urls import patterns, url, include
from django.views.generic import TemplateView

from .views import CreateOutputWebGis, temporary_file_download, BuildYourWebGisMainPage, TestEchoPostForm

urlpatterns = patterns('',
    url(r'^$', BuildYourWebGisMainPage.as_view()),
    url(r'create/$',CreateOutputWebGis.as_view(), name='create'),
    url(r'post_form_echo/$',TestEchoPostForm.as_view(), name='test_output_post_form'),
    #url(r'^$', CreateOutputWebGis.as_view(), name='create'),
    url(r'^tempfile/(?P<temporary_file>\w+)/$',temporary_file_download, name='temporary_file'),

)

