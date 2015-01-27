from django.conf.urls import patterns, include, url
from .root_views import RootTemplateViews
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = patterns('',
    url(r'^$', RootTemplateViews.as_view(), name='root'),
    # url(r'^buildyourwebgis/$', TemplateView.as_view(template_name='webmapgis.html')),
    url(r'^buildyourwebgis/', include('apps.create_webgis.urls')),
    # url(r'create/',include('apps.create_webgis.urls')),
    url(r'jsonp/',include('apps.jsonp.urls')),
)+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)