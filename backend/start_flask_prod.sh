#flask run --host 0.0.0.0 -p 5000 --no-debugger --key=/etc/letsencrypt/live/rc1.grodok.com/privkey.pem --cert /etc/letsencrypt/live/rc1.grodok.com/cert.pem
#gunicorn -w 4 -b 0.0.0.0:5000 app 
gunicorn --certfile=/etc/letsencrypt/live/api.grodok.com/fullchain.pem  --keyfile=/etc/letsencrypt/live/api.grodok.com/privkey.pem -w 4 --timeout 500 --bind 0.0.0.0:5000 app
