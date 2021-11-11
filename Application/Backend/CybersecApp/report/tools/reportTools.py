from connexions.models import Frame, LocalMachine, Destinations
from datetime import datetime, timedelta
from operator import or_
from functools import reduce
from django.db.models import Q

def getLocalMachineName(ip):
    machine = LocalMachine.objects.filter(ip=ip).first()
    if machine is not None and machine.name:
        return machine.name
    else:
        return ''

def getDestHostName(ip):
    machine = Destinations.objects.filter(ip=ip).first()
    if machine is not None and machine.name:
        return machine.name
    else:
        return ''

def getGlobalReport(date):

    #------- Get Frames--------
    dates = []
    report_frames = []

    # today
    if date == 'd':
        start = datetime.now().strftime('%Y-%m-%d')
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
    destinationCount = {k: destinationCount[k] for k in list(destinationCount)[:10]}
    topdestination = [{'ip': k, 'name': getDestHostName(k),'count': destinationCount[k]} for k in destinationCount]

    # intern IPs and data consummed
    sources = [ip for ip in ips if ip is not None and '192.168.2.' in ip]
    #datas = [data_by_ip[ip] for ip in sources]
    data_by_ip = [{'ip': ip,'name': getLocalMachineName(ip),'total': data_by_ip[ip]} for ip in sources]

    # connexions par machine (+++ par date)
    connexions_by_date = []
    for day in dates:
        connexions = []
        for src in sources:
            frames = report_frames.filter(ip_src=src, frame_time__startswith=day).order_by('id')
            if len(frames) > 0:
                connexions.append({
                    'ip': src,
                    'name': getLocalMachineName(src),
                    'first_con': frames.first().frame_time,
                    'last_con': frames.last().frame_time,
                    'destinations': ['{} [{}]'.format(item['ip_dst'], getDestHostName(item['ip_dst'])) for item in frames.order_by('ip_dst').distinct('ip_dst').values('ip_dst')],
                    })
        if len(connexions) > 0:
            connexions_by_date.append({
                'date': day,
                'connexions': connexions
            })

    return {
        'total_data': total_data,
        'top_dest': topdestination,
        'data_by_ip': data_by_ip,
        'connexions_by_date': connexions_by_date
    }


'''
def getGlobalReport(date):

    #------- Get Frames--------
    dates = []
    report_frames = []

    # today
    if date == 'd':
        start = datetime.now().strftime('%Y-%m-%d')
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
    destinationCount = {k: destinationCount[k] for k in list(destinationCount)[:10]}
    topdestination = {}
    topdestination['destinations'] = [item for item in destinationCount]
    topdestination['count'] = [destinationCount[item] for item in destinationCount]

    # intern IPs and data consummed
    sources = [ip for ip in ips if ip is not None and '192.168.2.' in ip]
    datas = [data_by_ip[ip] for ip in sources]

    # connexions par machine (+++ par date)
    connexions_by_date = {}
    for day in dates:
        connexions = {}
        for src in sources:
            frames = report_frames.filter(ip_src=src, frame_time__startswith=day).order_by('id')
            if len(frames) > 0:
              connexions[src] = {
                'first connexion': frames.first().frame_time,
                'last connexion': frames.last().frame_time,
                'connections': [item['ip_dst'] for item in frames.order_by('ip_dst').distinct('ip_dst').values('ip_dst')],
                }  
           # l = [item['ip_dst'] for item in report_frames.filter(ip_src=src, frame_time__startswith=day).order_by('id').order_by('ip_dst').distinct('ip_dst').values('ip_dst')]
            #if len(l)>0:
             #   connexions[src]={ }
        connexions_by_date[day] = connexions
    return {
        'total_data': total_data,
        'top_dest': topdestination,
        'LAN machines': sources,
        'datas': datas,
        'Connexions': connexions_by_date
    }'''