from django.conf.urls import patterns, url

from EventCard import views

urlpatterns = patterns('',
	url(r'^$', views.index, name='index'),
	url(r'^login$', views.user_login, name='user_login'),
	url(r'^logout$', views.user_logout, name='user_logout'),
	url(r'^signup$', views.user_signup, name='user_signup'),
	url(r'^events$', views.events, name='events')
)
