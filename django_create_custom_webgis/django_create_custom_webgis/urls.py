from django.conf.urls import patterns, include, url
from .root_views import RootTemplateViews
from django.views.generic import TemplateView
urlpatterns = patterns('',
    url(r'^$', RootTemplateViews.as_view(), name='root'),
    # url(r'^buildyourwebgis/$', TemplateView.as_view(template_name='webmapgis.html')),
    url(r'^buildyourwebgis/', include('apps.create_webgis.urls')),
    # url(r'create/',include('apps.create_webgis.urls')),
    url(r'jsonp/',include('apps.jsonp.urls')),
)
