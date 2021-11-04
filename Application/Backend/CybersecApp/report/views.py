#from django.db.models import Count
from rest_framework.response import Response
from rest_framework.views import APIView
from .tools.reportTools import getGlobalReport

class GlobalReport(APIView):
    def get(self, request, date):
        context = getGlobalReport(date)
        return Response(context)