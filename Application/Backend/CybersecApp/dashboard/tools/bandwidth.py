from connexions.models import Frame

def getTotalBandwidth(ips, date='2021'):
    result = []
    for ip in ips:
        frames1 = Frame.objects.filter(ip_src=ip, frame_time__startswith=date, is_online=True)
        frames2 = Frame.objects.filter(ip_dst=ip, frame_time__startswith=date, is_online=True)
        lengths = frames1.union(frames2).order_by('id').values('frame_len')
        total = round(sum([i['frame_len'] for i in lengths])*8/1000, 2)
        result.append(total)
    return result