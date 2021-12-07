from django.urls import path

from connexions.api.views import OfflineConnexionsView, OnlineHMMCheckView, FrameCaptureConfView, SuspiciousIpView, LocalMachineView


app_name = 'connexions'

urlpatterns = [
    path('offline/', OfflineConnexionsView.as_view()),  # admin
    path('online/checkhmm/', OnlineHMMCheckView.as_view()),  # auto-redirect
    path('blacklist/', SuspiciousIpView.as_view()),   # auto-redirect and web app
    path('frames_capture_conf/', FrameCaptureConfView.as_view()),  # admin
    path('localMachines/', LocalMachineView.as_view()),  # admin

]
