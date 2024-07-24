FROM python:3.8

WORKDIR /app

COPY ./srcs /app/
COPY ./requirements.txt /app/

RUN pip install -r requirements.txt

# CMD [ "tail", "-f" ]
CMD [ "python",  "manage.py", "runserver", "0.0.0.0:8000" ]
#   python  manage.py runserver 0.0.0.0:8000
