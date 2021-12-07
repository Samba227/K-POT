from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import FrameSerializer, HMMLabelSerializer, FrameCaptureConfSerializer,SuspiciousIpSerializer, LocalMachineSerializer
from ..models import Frame, HMMLearning, HMMOnline, FrameCaptureConf, SuspiciousIp, LocalMachine
from ..tools.HMMConversion import HMMConversion
from ..tools.HMMCheck import search_hmm_label


class OfflineConnexionsView(APIView):
    def get(self, request):
        distinct_con = []
        connexions = []
        # get only offline connexions frames
        frames = Frame.objects.filter(is_online=False).order_by('id')
        for frame in frames:
            if (frame.ip_src, frame.ip_dst, frame.mac_src, frame.mac_dst) not in distinct_con and (
            frame.ip_dst, frame.ip_src, frame.mac_dst, frame.mac_src) not in distinct_con:
                connexions.append({'ipSource': frame.ip_src,
                                   'ipDest': frame.ip_dst,
                                   'macSource': frame.mac_src,
                                   'macDest': frame.mac_dst})
                distinct_con.append((frame.ip_src, frame.ip_dst, frame.mac_src, frame.mac_dst))

        return Response({
            'connexions': connexions,
        })

    def post(self, request):
        context = {}
        ip_src = request.data.get('ipSource')
        ip_dst = request.data.get('ipDest')
        mac_src = request.data.get('macSource')
        mac_dst = request.data.get('macDest')

        if ip_src is None or ip_dst is None or mac_src is None or mac_dst is None:
            context['failure'] = True
        else:

            frames1 = Frame.objects.filter(ip_src=ip_src, ip_dst=ip_dst, mac_src=mac_src, mac_dst=mac_dst, is_online=False)
            frames2 = Frame.objects.filter(ip_src=ip_dst, ip_dst=ip_src, mac_src=mac_dst, mac_dst=mac_src, is_online=False)
            frames = frames1.union(frames2).order_by('id')

            context['success'] = True
            frame_serializer = FrameSerializer(frames, many=True)
            context['frames'] = frame_serializer.data

            # connexion pour la recherche dans la table HMMLearning
            form1 = '{},{},{},{}'.format(ip_src, ip_dst, mac_src, mac_dst)
            form2 = '{},{},{},{}'.format(ip_dst, ip_src, mac_dst, mac_src)

            hmm = HMMLearning.objects.filter(connexion=form1).first()
            if hmm is None:
                hmm = HMMLearning.objects.filter(connexion=form2).first()

            if hmm is not None:
                context['hmm'] = {}
                # create an instance of HMMConversion to convert split the string to matrix
                hmmUtil = HMMConversion(hmm)
                states = hmmUtil.get_states()
                transition_matrix = hmmUtil.get_transition_matrix()
                emission_matrix = hmmUtil.get_emission_matrix()

                context['hmm']['connexion'] = hmm.connexion
                context['hmm']['states'] = states
                context['hmm']['transitionMatrix'] = transition_matrix
                context['hmm']['emissionMatrix'] = emission_matrix
                context['hmm']['label'] = hmm.label
        return Response(context)

    # for updating an offline HMM's label
    def put(self, request):
        
        conn = request.data.get('connexion')
        label = request.data.get('label')
        context = {}
        if conn is not None and label is not None:
            hmm = HMMLearning.objects.filter(connexion=conn).first()
            if hmm is not None:
                serializer = HMMLabelSerializer(hmm, data=request.data)
                if serializer.is_valid():
                    serializer.save()
                    context['success'] = True
                else:
                    context['failure'] = True
            else:
                context['failure'] = True
        else:
            context['fieldsError'] = True
        return Response(context)


class OnlineHMMCheckView(APIView):
    def post(self, request):
        conn = request.data.get('connexion')
        context = {}
        if conn is not None :
            hmm = HMMOnline.objects.filter(connexion=conn).first()
            if hmm is not None:
                label, distance = search_hmm_label(hmm)
                context['success'] = True
                context['label'] = label
                context['distance'] = distance
            else:
                context['failure'] = True
        else:
            context['fieldsError'] = True
        return Response(context)


class FrameCaptureConfView(APIView):
    def get(self, request):
        context = {}
        context['success'] = True

        # send existing config or an empty data

        config = FrameCaptureConf.objects.all().first()
        if config is not None:
            serializer = FrameCaptureConfSerializer(config)
            
            context['config'] = serializer.data

        else:
            context['config'] = {
                'id': 1,
                'interface_ip': '',
                'frames_number': 0
            }
        return Response(context)

    def put(self, request):
        id = request.data.get('id')
        interfaceIp = request.data.get('interface_ip')
        framesNumber = request.data.get('frames_number')
        context = {}
        # if id is not None and interfaceIp is not None and framesNumber is not None:
        if id is not None and interfaceIp is not None and framesNumber is not None:

            try:
                config = FrameCaptureConf.objects.get(pk=id)
                serializer = FrameCaptureConfSerializer(config, data=request.data)

                if serializer.is_valid():
                    serializer.save()
                    context['success'] = True
                else:
                    context['failure'] = True

            except FrameCaptureConf.DoesNotExist:
                config = FrameCaptureConf.objects.all().first()
                if config is not None:
                    serializer = FrameCaptureConfSerializer(config, data=request.data)
                else:
                    serializer = FrameCaptureConfSerializer(data=request.data)
                    
                if serializer.is_valid():
                    serializer.save()
                    context['success'] = True
                else:
                    context['failure'] = True

        else:
            context['fieldsError'] = True
        return Response(context)


# suspicious Ips View
class SuspiciousIpView(APIView):
    def get(self, request):
        context = {}
        ips = SuspiciousIp.objects.all()
        serializer = SuspiciousIpSerializer(ips, many=True)
        context['BlacklistIPs'] = serializer.data

        return Response(context)

    def post(self, request):
        context = {}
        address = request.data.get('address')

        if address is not None:
            # check that the ip is not already saved
            ip = SuspiciousIp.objects.filter(address__icontains=address).first()
            if ip is not None:
                context['error'] = 'Already Blacklisted'
            else:
                serializer = SuspiciousIpSerializer(data=request.data)
                if serializer.is_valid():
                    serializer.save()
                    context['success'] = True 
                else:
                    context['error'] = 'Failed to add'
        else:
            context['error'] = 'fieldsError'

        return Response(context)


class LocalMachineView(APIView):
    def get(self, request):
        context = {}

        # send existing config or an empty data

        machines = LocalMachine.objects.all()
        serializer = LocalMachineSerializer(machines, many=True)
            
        context['machines'] = serializer.data
        return Response(context)

    def put(self, request):
        ip = request.data.get('ip')
        name = request.data.get('name')
        context = {}

        if ip is not None and name is not None:
            machine = LocalMachine.objects.filter(ip=ip).first()
            if machine is not None:
                serializer = LocalMachineSerializer(machine, data=request.data)

                if serializer.is_valid():
                    serializer.save()
                    context['success'] = True
                else:
                    context['failure'] = True
            else:
                context['failure'] = True

        else:
            context['failure'] = True
        return Response(context)

