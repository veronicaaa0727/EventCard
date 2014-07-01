from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'EventCard_Project.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
	url(r'^', include('EventCard.urls', namespace='EventCard')),
    url(r'^admin/', include(admin.site.urls), name='admin'),
)
