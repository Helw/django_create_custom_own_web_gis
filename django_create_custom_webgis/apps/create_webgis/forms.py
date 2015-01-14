__author__ = 'v-user'
from django import forms

BASELAYERS= set(('google_sat','openstreetmap'))

class BaseLayerForm(forms.Form):

    baselayers = forms.CharField(max_length=255)
    wmslayers = forms.CharField(max_length=255)



    def clean_baselayers(self):

        baselayers = set(self.cleaned_data['baselayers'].split(';'))


        # if len(baselayers.difference(BASELAYERS)):
        #     raise forms.ValidationError('Wrong Base Layer')

        return baselayers

    def clean_wmslayers(self):

        wmslayers = set(self.cleaned_data['wmslayers'].split(';'))

        return wmslayers

