from django.shortcuts import render

# Create your views here.
def home_view(request):
    print("request = ", request)
    return render(request, 'multi/index.html')