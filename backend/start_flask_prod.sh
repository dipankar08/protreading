<<<<<<< HEAD
#fist copy the ids
sudo cp /etc/letsencrypt/live/dev.api.grodok.com/fullchain.pem ~/
sudo cp /etc/letsencrypt/live/dev.api.grodok.com/privkey.pem ~/
sudo chmod 777  ~/fullchain.pem
sudo chmod 777  ~/privkey.pem
gunicorn --certfile=$HOME/fullchain.pem  --keyfile=$HOME/privkey.pem -w 4 --timeout 500 --bind 0.0.0.0:5000 app
=======
#flask run --host 0.0.0.0 -p 5000 --no-debugger --key=/etc/letsencrypt/live/rc1.grodok.com/privkey.pem --cert /etc/letsencrypt/live/rc1.grodok.com/cert.pem
#gunicorn -w 4 -b 0.0.0.0:5000 app 
gunicorn --certfile=/etc/letsencrypt/live/dev.api.grodok.com/fullchain.pem  --keyfile=/etc/letsencrypt/live/dev.api.grodok.com/privkey.pem -w 4 --timeout 500 --bind 0.0.0.0:5000 app
>>>>>>> 4316679f30d6ad74ac3f4cea03afe28f996acf3f
