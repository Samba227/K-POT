from connexions.models import Frame
from datetime import datetime, timedelta
from operator import or_
from functools import reduce
from django.db.models import Q

def getIPConsumption(ip, date=None):
    total_sent = 0
    total_recieved = 0
    if date is None:
        frames_sent = Frame.objects.filter(ip_src=ip, is_online=True).values('frame_len')
        frames_recieved = Frame.objects.filter(ip_dst=ip, is_online=True).values('frame_len')
        total_sent = round(sum([i['frame_len'] for i in frames_sent])*8/1000,2)
        total_recieved = round(sum([i['frame_len'] for i in frames_recieved])*8/1000,2)

    else:
        frames_sent = Frame.objects.filter(ip_src=ip, frame_time__startswith=date, is_online=True).values('frame_len')
        frames_recieved = Frame.objects.filter(ip_dst=ip, frame_time__startswith=date, is_online=True).values('frame_len')
        total_sent = round(sum([i['frame_len'] for i in frames_sent])*8/1000,2)
        total_recieved = round(sum([i['frame_len'] for i in frames_recieved])*8/1000,2)

    return total_sent, total_recieved


def getTotalConsumption(ips, date=None):
    result = []
    if date is None:
        date = (datetime.now()).strftime('%Y')
    for ip in ips:
        frames1 = Frame.objects.filter(ip_src=ip, frame_time__startswith=date, is_online=True)
        frames2 = Frame.objects.filter(ip_dst=ip, frame_time__startswith=date, is_online=True)
        lengths = frames1.union(frames2).order_by('id').values('frame_len')
        total = round(sum([i['frame_len'] for i in lengths])*8/1000, 2)
        result.append(total)
    return result


#date in 's,d,m,y' , by default = total consumption
def getIPConsumptionByDate(ip, date=None):
    d = datetime.now() - timedelta(seconds=1)
    start = None
    if date is None or date not in 'sdmy':
        start = d.strftime('%Y')
    else:
        if date == 's':
            start = d.strftime('%Y-%m-%d %H:%M:%S')
        elif date == 'd':
            start = d.strftime('%Y-%m-%d')
        elif date == 'm':
            start = d.strftime('%Y-%m')
        else:
            start = d.strftime('%Y')
    sent, recieved = getIPConsumption(ip, start)

    return {'success': True, 'sent': sent, 'recieved': recieved}


def getGlobalReport(date):

    #------- Get Frames--------
    dates = []
    report_frames = []

    # today
    if date == 'd':
        start = datetime.now().strftime('%Y-%m-%d')
        start = '2021-10-29'
        dates.append(start)

    # last 7 days
    elif date == 'w':
        dates = [d.strftime('%Y-%m-%d') for d in [datetime.now()-timedelta(days=i) for i in range(1,8)]]

    # last 30 days
    elif date == 'm':
        dates = [d.strftime('%Y-%m-%d') for d in [datetime.now()-timedelta(days=i) for i in range(1,31)]]

    query = reduce(or_, (Q(frame_time__startswith=day, is_online=True) for day in dates))
    report_frames = Frame.objects.filter(query).order_by('id')

    # get distinct ips
    all_ips = report_frames.order_by('ip_src').distinct('ip_src').values('ip_src')
    ips = [i['ip_src'] for i in all_ips]


    # total data
    lengths = report_frames.values('frame_len')
    total_data = round(sum([i['frame_len'] for i in lengths])*8/1000, 2)

    #----data by all users
    data_by_ip = {}
    for ip in ips:
        frames1 = report_frames.filter(ip_src=ip, is_online=True)
        frames2 = report_frames.filter(ip_dst=ip, is_online=True)
        lengths = frames1.union(frames2).values('frame_len')
        total = round(sum([i['frame_len'] for i in lengths])*8/1000, 2)
        data_by_ip[ip] = total
    
    # top destinations
    destinations = [ip for ip in ips if ip is not None and '192.168.2.' not in ip]
    destinationCount = {}
    for destination in destinations:
        destinationCount[destination] = data_by_ip[destination]

    destinationCount = {k:v for k,v in sorted(destinationCount.items(), key=lambda item: item[1], reverse=True)}
    destinationCount = {k: destinationCount[k] for k in list(destinationCount)}
    topdestination = {}
    topdestination['destinations'] = [item for item in destinationCount]
    topdestination['count'] = [destinationCount[item] for item in destinationCount]

    # intern IPs
    sources = [ip for ip in ips if ip is not None and '192.168.2.' in ip]

    # connexions par machine
    connexions = {}
    for src in sources:
        connexions[src] = [item['ip_dst'] for item in report_frames.filter(ip_src=src).order_by('ip_dst').distinct('ip_dst').values('ip_dst')]
    
    return {
        'total_frames': len(report_frames),
        'total_data': total_data,
        'data_by_ip': data_by_ip,
        'top_dest': topdestination,
        'LAN machines': sources,
        'Connexions': connexions
    }