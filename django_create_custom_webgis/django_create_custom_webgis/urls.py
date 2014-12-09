from django.conf.urls import patterns, include, url
from django.contrib import admin
from .root_views import RootTemplateViews
from django.views.generic import TemplateView

urlpatterns = patterns('',
    #url(r'^admin/', include(admin.site.urls)),
    url(r'^$', RootTemplateViews.as_view(), name='root'),
    url(r'^buildyourwebgis/(?P<sessionid>\w+)/$', TemplateView.as_view(template_name='webmapgis.html')),
)
