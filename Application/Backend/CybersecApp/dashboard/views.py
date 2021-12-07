from rest_framework.response import Response
from rest_framework.views import APIView
from .tools.dashboardTool import get_devices, get_active_devices, get_device_consumption, get_total_consumption

# global variable for identifying local devices
local = '192.168.2'


# -------new version ------
class TotalConsumption(APIView):
    def get(self, request, date):
        result = get_total_consumption(date)
        return Response(result)

# -------------


class LocalDevices(APIView):
    def get(self, request, filter):  # filter in ['all', 'active']
        context = {}
        if filter == 'all':
            context = get_devices()
        elif filter == 'active':
            context = get_active_devices()
        return Response(context)


class DeviceConsumption(APIView):
    def get(self, request, ip, date):  # date in 's' 'd'
        context = get_device_consumption(ip, date)
        return Response(context)
