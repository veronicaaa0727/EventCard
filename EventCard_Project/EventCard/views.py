from django.shortcuts import render,redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.core.urlresolvers import reverse

from EventCard.models import UserProfile

def index(request):
	if request.user.is_authenticated():
		return redirect(reverse('EventCard:events'))
	else:
		return render(request, 'EventCard/index.html')

def user_signup(request):
	if request.method == 'POST':
		email = request.POST['email']
		password = request.POST['password']	
		if not User.objects.filter(username=email).exists():
			user = User.objects.create_user(email, email, password)
			user.first_name = request.POST['first_name']
			user.last_name = request.POST['last_name']
			user.save()
			profile = UserProfile()
			profile.user = user
			profile.description = request.POST['description']
			profile.save()
			user = authenticate(username=email, password=password)
			login(request, user)
			return redirect(reverse('EventCard:events'))
		else:
			return render(request, 'EventCard/signup.html', {'message':'Email exists! Try another one...'})
	else:
		return render(request, 'EventCard/signup.html')

def user_login(request):
	if request.method == 'POST':
		username = request.POST['email']
		password = request.POST['password']
		user = authenticate(username=username, password=password)
		if user:
			login(request, user)
			return redirect(reverse('EventCard:events'))
		else:
			return render(request, 'EventCard/login.html', {'message':'Email or Password is invalid!'})
	else:
		return render(request, 'EventCard/login.html')

def user_logout(request):
	logout(request)
	return redirect(reverse('EventCard:index'))

def events(request):
	return render(request, 'EventCard/events.html')
