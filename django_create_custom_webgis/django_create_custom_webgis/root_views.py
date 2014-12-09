__author__ = 'v-user'
from django.views.generic import TemplateView
import uuid

class RootTemplateViews(TemplateView):

    template_name = template_name='base.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        session_id = str(uuid.uuid4())
        context['session_id'] = session_id.replace('-','_')
        return context
