from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Report
from .serializers import ReportSerializer


class GlobalReport(APIView):
    def get(self, request, date=None):
        if date is None:
            dates = Report.objects.order_by('date').values('date')
            all_dates = [item['date'] for item in dates]
            return Response({
                'dates': all_dates
            })

        else:
            report = Report.objects.filter(date=date).last()
            if report is not None:
                serializer = ReportSerializer(report)
                return Response({
                    'report': serializer.data
                })
            else:
                return Response({
                    'empty': True
                })
