__author__ = 'v-user'
from django import forms

BASELAYERS= ['google_sat','openstreetmap']

class BaseLayerForm(forms.Form):

    name = forms.CharField(max_length=30)

    # def clean(self):
    #
    #     cleaned_data = super().clean()
    #

    def clean_name(self):

        name = self.cleaned_data['name']
        if not name in BASELAYERS:
            raise forms.ValidationError('Wrong Base Layer')


        return name