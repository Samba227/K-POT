from connexions.models import Frame, LocalMachine
from django.db.models import Sum
from datetime import datetime, timedelta

# global variable for identifying local devices
local = '192.168.2.'


def get_total_consumption(date):  # date in 's d'
    today = datetime.now() - timedelta(seconds=1)
    start = ''
    if date == 's':
        start = today.strftime('%Y-%m-%d %H:%M:%S')
    elif date == 'd':
        start = today.strftime('%Y-%m-%d')
    sum_ = Frame.objects.filter(frame_time__startswith=start, is_online=True).values('frame_len').aggregate(Sum('frame_len'))['frame_len__sum']
    if sum_ is None:
        sum_ = 0
    total = round(sum_/1000, 2)
    return {
        'success': True,
        'total': total
    }


def get_devices():
    devices = LocalMachine.objects.order_by('ip').values('ip', 'name')
    result = []
    for device in devices:
        result.append({
            'ip': device['ip'],
            'name': device['name'],
            'isActive': False,
        })
    return {
        'success': True,
        'devices': result
    }


def get_active_devices():
    start = (datetime.now() - timedelta(seconds=1)).strftime('%Y-%m-%d %H:%M')
    ips1 = Frame.objects.filter(ip_src__startswith=local, frame_time__startswith=start, is_online=True).order_by('ip_src').distinct('ip_src').values('ip_src')
    ips2 = Frame.objects.filter(ip_dst__startswith=local, frame_time__startswith=start, is_online=True).order_by('ip_dst').distinct('ip_dst').values('ip_dst')
    ips = [item['ip_src'] for item in ips1.union(ips2)]
    return {
        'success': True,
        'ips': ips
    }


def get_device_consumption(ip, date):  # date in 's d'
    today = datetime.now() - timedelta(seconds=1)
    start = ''
    if date == 's':
        start = today.strftime('%Y-%m-%d %H:%M:%S')
    elif date == 'd':
        start = today.strftime('%Y-%m-%d')

    data_sent = Frame.objects.filter(ip_src=ip, frame_time__startswith=start, is_online=True).values('frame_len')
    data_received = Frame.objects.filter(ip_dst=ip, frame_time__startswith=start, is_online=True).values('frame_len')
    total_sent = round(sum([i['frame_len'] for i in data_sent]) / 1000, 2)
    total_received = round(sum([i['frame_len'] for i in data_received]) / 1000, 2)
    return {
        'success': True,
        'received': total_received,
        'sent': total_sent
    }
