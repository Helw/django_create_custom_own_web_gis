__author__ = 'v-user'
from django import forms
from .utils.utils import validation_user_layer_uploaded

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


class UserLayerDataForm(forms.Form):

    userlayer = forms.FileField()

    def clean(self):

        cleaned_data = super(UserLayerDataForm, self).clean()
        uploadUserfile =  cleaned_data.get('userlayer')
        layer_is_valid = validation_user_layer_uploaded(uploadUserfile)
        if layer_is_valid:
            return cleaned_data
        else:
            raise forms.ValidationError("Please upload a valid Layer")


