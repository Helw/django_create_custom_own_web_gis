
from django.http import HttpResponse
import requests
from urllib.parse import urlsplit,unquote
import json
#getinfo request to proxy
#http://forest.jrc.ec.europa.eu/proxy/?url=http%3A%2F%2Fgeohub.jrc.ec.europa.eu%2Fforest%2Feffis%2Fmapserv%2Ffwi%3FLAYERS%3Dfd_ecmwf14_FWI%26FORMAT%3Dimage%252Fpng%26TRANSPARENT%3DTRUE%26DAY%3D16-Jan-2015%26FORECAST%3D1%26SERVICE%3DWMS%26VERSION%3D1.1.1%26REQUEST%3DGetFeatureInfo%26STYLES%3D%26SRS%3DEPSG%253A900913%26EXCEPTIONS%3Dapplication%252Fvnd.ogc.se_xml%26BBOX%3D-1820892.916382%252C3161292.79891%252C4734346.628442%252C10010050.532309%26X%3D178.5%26Y%3D315.71665954589844%26INFO_FORMAT%3Dtext%252Fhtml%26QUERY_LAYERS%3Dfd_ecmwf14_FWI%26WIDTH%3D670%26HEIGHT%3D700

def json_proxy(request):
    if 'url' not in request.GET:
        return HttpResponse(
                "The proxy service requires a URL-encoded URL as a parameter.",
                status=400,
                content_type="text/plain"
                )

    url = unquote(request.GET['url'])
    callback_name = unquote(request.GET['callback'])

    conn = requests.get(url)
    result_html = conn.text #html text
    #recentPosts({/*JSON data from CNJ*/})
    jsonp_response = callback_name+'({"html":"'+result_html.rstrip().replace('\n', '')+'"})' # attenzione spazio alla fine correggere




    #jsonp_response = callback_name+'({"html":"<H2>Fire Danger</H2><table><tr><td>Date</td><td>16-JAN-15</td></tr></table>"})'


    return HttpResponse(jsonp_response,content_type="application/json")


