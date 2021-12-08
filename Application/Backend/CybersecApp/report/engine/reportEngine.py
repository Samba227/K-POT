from connexions.models import Frame, LocalMachine, Destinations
from datetime import datetime, timedelta
from django.db.models import  Sum

local = '192.168.2.'


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


def getGlobalReport():

    start = datetime.now().strftime('%Y-%m-%d')
    report_frames = Frame.objects.filter(frame_time__startswith=start, is_online=True).order_by('id')

    # total data
    len_sum = report_frames.aggregate(Sum('frame_len'))['frame_len__sum']
    if len_sum is None:
        len_sum = 0
    total_data = round(len_sum/1000, 2)

    # get distinct ips
    
    all_ips = report_frames.filter(ip_src__startswith=local).order_by('ip_src').distinct('ip_src').values('ip_src')
    locals = [i['ip_src'] for i in all_ips]

    # ----data by all users
    data_by_ip = {}
    for ip in locals:
        frames1 = report_frames.filter(ip_src=ip)
        frames2 = report_frames.filter(ip_dst=ip)
        lengths = frames1.union(frames2).values('frame_len')
        total = round(sum([i['frame_len'] for i in lengths]) / 1000, 2)
        data_by_ip[ip] = total
    data_by_ip = [{'ip': ip, 'name': getLocalMachineName(ip), 'total': data_by_ip[ip]} for ip in locals]
    '''
    return {
        'total': total_data,
        'data_by_ip': data_by_ip,
        'ips': locals,
    }
    '''
    # connexions par machine (+++ par date)
    connexions = []
    for src in locals:
        frames = report_frames.filter(ip_src=src, frame_time__startswith=start).order_by('id')
        if len(frames) > 0:
            connexions.append({
                'ip': src,
                'name': getLocalMachineName(src),
                'first_con': frames.first().frame_time,
                'last_con': frames.last().frame_time,
                'destinations': ['{} [{}]'.format(item['ip_dst'], getDestHostName(item['ip_dst'])) for item in frames.order_by('ip_dst').distinct('ip_dst').values('ip_dst')],
                })

    return {
        'total': total_data,
        'data_by_ip': data_by_ip,
        'connexions': connexions
    }

