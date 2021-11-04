from django.db import models


class Frame(models.Model):
    frame_time = models.CharField(max_length=100, blank=True, null=True)
    frame_time_delta = models.IntegerField(blank=True, null=True)
    frame_type = models.CharField(max_length=100, blank=True, null=True)
    mac_src = models.CharField(max_length=100, blank=True, null=True)
    mac_dst = models.CharField(max_length=100, blank=True, null=True)
    ip_src = models.CharField(max_length=100, blank=True, null=True)
    ip_dst = models.CharField(max_length=100, blank=True, null=True)
    protocol = models.CharField(max_length=100, blank=True, null=True)
    port_src = models.CharField(max_length=100, blank=True, null=True)
    port_dst = models.CharField(max_length=100, blank=True, null=True)
    flags = models.IntegerField(blank=True, null=True)
    frame_len = models.IntegerField(blank=True, null=True)

    is_online = models.BooleanField(null=False, default=False)

    def __str__(self):
        return 'Frame  : {} - {}'.format(self.pk, self.online())

    def online(self):
        if self.is_online:
            return 'Online'
        else:
            return 'Offline'
        

class HMMLearning(models.Model):
    connexion = models.CharField(max_length=100, blank=True, null=True)
    states = models.CharField(max_length=100, blank=True, null=True)
    transition_matrix = models.CharField(max_length=1000, blank=True, null=True)
    emission_matrix = models.CharField(max_length=1000, blank=True, null=True)
    
    label = models.CharField(max_length=1000, blank=True, null=True)

    def __str__(self):
        return 'HMM for : {} : {}'.format(self.connexion, self.label)


class HMMOnline(models.Model):
    connexion = models.CharField(max_length=100, blank=True, null=True)
    states = models.CharField(max_length=100, blank=True, null=True)
    transition_matrix = models.CharField(max_length=1000, blank=True, null=True)
    emission_matrix = models.CharField(max_length=1000, blank=True, null=True)

    def __str__(self):
        return 'HMM Online for : {}'.format(self.connexion)



#   class pour les parametres de capture de paquets 

class FrameCaptureConf(models.Model):
    interface_ip = models.CharField(max_length=100, blank=False, null=False, default='10.0.3.15')
    frames_number = models.IntegerField(null=False, default=20)

    def __str__(self):
        return 'FrameCaptureConf on eth: {}'.format(self.interface_ip)


# table des adresses Ips suspects
class SuspiciousIp(models.Model):
    address = models.CharField(max_length=100, blank=True, null=True, unique=True)

    def __str__(self):
        return '{}'.format(self.address)

#  classes pour la resolution @IP => Name

class LocalMachine(models.Model):
    ip = models.CharField(max_length=100, blank=True, null=True)
    name = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return '{} [{}]'.format(self.ip, self.name)

class Destinations(models.Model):
    ip = models.CharField(max_length=100, blank=True, null=True)
    name = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return '{} [{}]'.format(self.ip, self.name)