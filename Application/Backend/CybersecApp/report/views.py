#from django.db.models import Count
from rest_framework.response import Response
from rest_framework.views import APIView
from connexions.models import Frame
from datetime import datetime, timedelta
from .tools.reportTools import getIPConsumptionByDate, getGlobalReport
from dashboard.tools.bandwidth import getTotalBandwidth
'''
class Index(APIView):
    def get(self, request):
        context = {}
        #top usernames
        profiles = HomeLoginattempt.objects.values('username')
        usernames = [item['username'] for item in profiles]
        usernameCount = {}
        for username in usernames:
            if username not in usernameCount:
                usernameCount[username] = 1
            else:
                usernameCount[username] += 1
        usernameCount = {k:v for k,v in sorted(usernameCount.items(), key=lambda item: item[1], reverse=True)}
        usernameCount = {k: usernameCount[k] for k in list(usernameCount)[:5]}
        topUsername = {}
        topUsername['usernames'] = [item for item in usernameCount]
        topUsername['count'] = [usernameCount[item] for item in usernameCount]

        context['topUsername'] = topUsername
        # !------top usernames

        #top IP
        profiles = HomeProfile.objects.annotate(count=Count('homeloginattempt')).order_by('-count').values('ip', 'count')
        
        context['topIPs'] = profiles
        # !------top IP

        #Passwords Attemps
        profiles = HomeLoginattempt.objects.values('password')
        passwords = [item['password'] for item in profiles]
        passwordCount = {}
        for password in passwords:
            if password not in passwordCount:
                passwordCount[password] = 1
            else:
                passwordCount[password] += 1
        passwordCount = {k:v for k,v in sorted(passwordCount.items(), key=lambda item: item[1], reverse=True)}
        passwordCount = {k: passwordCount[k] for k in list(passwordCount)[:5]}
        topPassword = {}
        topPassword['password'] = [item for item in passwordCount]
        topPassword['count'] = [passwordCount[item] for item in passwordCount]

        context['topPassword'] = topPassword
        # !------top Password

        #Username and Passwords Attemps
        attempts = HomeLoginattempt.objects.distinct('username', 'password').values('username', 'password')
        attempts = [{'attempt': item, 'count': HomeLoginattempt.objects.filter(username=item['username'], password=item['password']).count()} for item in attempts] 
        
        context['userPass'] = attempts
        # !------Username and Passwords Attemps


        #---- maps -----
        locations = HomeProfile.objects.distinct('city', 'location').values('city', 'location')
        for location in locations:
            location['location'] = location['location'].split(',')
            location['location'][0], location['location'][1] = float(location['location'][1]), float(location['location'][0])
        context['locations'] = locations
        # ---- ! maps-----

        return Response(context)
'''

class GlobalReport(APIView):
    def get(self, request, date):
        context = getGlobalReport(date)
        return Response(context)
        
class Bandwidth(APIView):
    def get(self, request):
    
        d = datetime.now() - timedelta(seconds=1)
        start = d.strftime('%Y-%m-%d %H:%M:%S')

        # get only intern machines bandwith consumption
        ips1 = Frame.objects.filter(ip_src__startswith='192.168.2.', is_online=True).order_by('ip_src').distinct('ip_src').values('ip_src')
        ips = [i['ip_src'] for i in ips1]
        return Response({'success': True, 'ips': ips, 'details': getTotalBandwidth(ips, start)})



class IPNetworkConsupmtion(APIView):
    def get(self, request, ip, date=None):
        context = getIPConsumptionByDate(ip, date)
        return Response(context)

class ActiveIps(APIView):
    def get(self, request, ip=None, date=None):
        context = {}
        if ip is None:
            d = datetime.now() - timedelta(seconds=1)
            start = d.strftime('%Y-%m-%d %H:%M')
            # get only intern machines bandwith consumption
            ips1 = Frame.objects.filter(ip_src__startswith='192.168.2.',frame_time__startswith=start, is_online=True).order_by('ip_src').distinct('ip_src').values('ip_src', 'mac_src')
            ips2 = Frame.objects.filter(ip_dst__startswith='192.168.2.',frame_time__startswith=start, is_online=True).order_by('ip_dst').distinct('ip_dst').values('ip_dst', 'mac_dst')
            context['active'] = ips1.union(ips2)
        else:
            context = getIPConsumptionByDate(ip, date)
        return Response(context)