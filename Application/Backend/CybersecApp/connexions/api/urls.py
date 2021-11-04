from django.urls import path

from connexions.api.views import OfflineConnexionsView, OnlineConnexionsView, OnlineHMMCheckView, FrameCaptureConfView, SuspiciousIpView, LocalMachineView


app_name = 'connexions'

urlpatterns = [
    path('offline/', OfflineConnexionsView.as_view()),
    path('online/', OnlineConnexionsView.as_view()),
    path('online/checkhmm/', OnlineHMMCheckView.as_view()),
    path('blacklist/', SuspiciousIpView.as_view()),
    path('frames_capture_conf/', FrameCaptureConfView.as_view()),
    path('localMachines/', LocalMachineView.as_view()),

]
