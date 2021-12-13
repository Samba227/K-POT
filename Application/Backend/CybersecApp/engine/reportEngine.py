import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'djangoProject.settings')
django.setup()

from connexions.models import Frame, LocalMachine, Destinations
from report.serializers import ReportSerializer
from datetime import datetime, timedelta
from django.db.models import Q, Sum

local = '192.168.2.'

def getHostName(ip):
    machine = LocalMachine.objects.filter(ip=ip).first()
    if machine is None:
        machine = Destinations.objects.filter(ip=ip).first()

    if machine is not None and machine.name:
        return machine.name
    else:
        return ip


def getGlobalReport(date):
    report_frames = Frame.objects.filter(frame_time__startswith=date, is_online=True).order_by('id')

    # total data
    len_sum = report_frames.aggregate(Sum('frame_len'))['frame_len__sum']
    if len_sum is None:
        len_sum = 0
    total_data = round(len_sum / 1000000, 2)

    # get distinct ips
    all_ips = report_frames.filter(ip_src__startswith=local).order_by('ip_src').distinct('ip_src').values('ip_src')
    locals = [i['ip_src'] for i in all_ips]

    # ----data by all users
    total_by_ip = {}
    for ip in locals:
        sent = report_frames.filter(ip_src=ip).aggregate(Sum('frame_len'))['frame_len__sum']
        if sent is None:
            sent = 0
        received = report_frames.filter(ip_dst=ip).aggregate(Sum('frame_len'))['frame_len__sum']
        if received is None:
            received = 0
        total_by_ip[ip] = round((sent + received) / 1000000, 2)
    data_by_ip = [{'ip': ip, 'name': getHostName(ip), 'total': total_by_ip[ip]} for ip in locals]

    # connexions par machine (+++ par date)
    connections_by_device = []
    for src in locals:
        frames = report_frames.filter(ip_src=src, frame_time__startswith=date).order_by('id')
        if len(frames) > 0:
            connections_by_device.append({
                'ip': src,
                'name': getHostName(src),
                'first_con': frames.first().frame_time,
                'last_con': frames.last().frame_time,
                'destinations': ['{}'.format(getHostName(item['ip_dst'])) for item in
                                 frames.order_by('ip_dst').distinct('ip_dst').values('ip_dst')],
            })

    # -- Render HTML Tags ------
    data_by_ip_html = '\
                      <table class="table table-bordered" id="dataByDevices" width="100%" cellspacing="0">\
                        <thead class="text-center bg-light">\
                            <tr>\
                                <th>IP Address</th>\
                                <th>Name</th>\
                                <th>Total (Mo)</th>\
                            </tr>\
                        </thead>\
                        <tbody class="text-center">'

    for item in data_by_ip:
        data_by_ip_html += '<tr>\
                                <td>{}</td>\
                                <td>{}</td>\
                                <td>{}</td>\
                            </tr>'.format(item['ip'], item['name'], item['total'])

    data_by_ip_html += '</tbody></table>'

    connections_by_device_html = '\
        <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">\
            <thead class="text-center bg-light"> \
                <tr>\
                    <th>IP Address</th>\
                    <th>Name</th>\
                    <th>First Con.</th>\
                    <th>Last Con.</th>\
                    <th>Destinations</th>\
                </tr>\
            </thead>\
            <tbody class="text-center">'

    for item in connections_by_device:
        connections_by_device_html += '\
            <tr>\
                <td>{}</td>\
                <td>{}</td>\
                <td>{}</td>\
                <td>{}</td>\
                <td class="text-justify">\
                    {}\
                </td>\
            </tr>'\
        .format(
            item['ip'],
            item['name'],
            item['first_con'][10:],
            item['last_con'][10:],
            ', '.join(item['destinations'])
        )

    connections_by_device_html += '</tbody></table>'

    return {
        'date': date,
        'total_data': total_data,
        'data_by_device': data_by_ip_html,
        'connections_by_device': connections_by_device_html
    }


if __name__ == '__main__':
    # start = datetime.now().strftime('%Y-%m-%d')
    print(datetime.now())
    starts = ['2021-11-22', '2021-11-23', '2021-11-26', '2021-11-27', '2021-11-28', '2021-11-29']
    for start in starts:
        result = getGlobalReport(start)
        serializer = ReportSerializer(data=result)
        if serializer.is_valid():
            serializer.save()

            # delete frames after report
            # Frame.objects.filter(frame_time__startswith=result['date'], is_online=True).delete()
        else:
            pass
    # print('total data = {}'.format(result['total_data']))
    print(datetime.now())
