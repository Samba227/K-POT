from connexions.models import Frame, LocalMachine
from datetime import datetime, timedelta


def getIPConsumption(ip, date=None):
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


# date in 's,d,m,y' , by default = total consumption
def getIPConsumptionByDate(ip, date=None):
    d = datetime.now() - timedelta(seconds=1)
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


def getAllIPConsumption(date=None):
    local_machines = LocalMachine.objects.order_by('ip').values('ip', 'name')
    ips = [i['ip'] for i in local_machines]
    
    if date is None or date not in 'dmy':
        date = None
    else:
        d = datetime.now()
        if date == 'd':
            date = d.strftime('%Y-%m-%d')
        elif date == 'm':
            date = d.strftime('%Y-%m')
        else:
            date = d.strftime('%Y')
    
    result = getTotalConsumption(ips, date)
    # rename ips
    for i in range(len(ips)):
        machine = LocalMachine.objects.filter(ip=ips[i]).first()
        if machine is not None and machine.name:
            ips[i] = machine.name

    return {'ips': ips, 'values': result}