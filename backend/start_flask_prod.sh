#fist copy the ids
sudo cp /etc/letsencrypt/live/dev.api.grodok.com/fullchain.pem ~/
sudo cp /etc/letsencrypt/live/dev.api.grodok.com/privkey.pem ~/
sudo chmod 777  ~/fullchain.pem
sudo chmod 777  ~/privkey.pem
gunicorn --certfile=$HOME/fullchain.pem  --keyfile=$HOME/privkey.pem -w 4 --timeout 500 --bind 0.0.0.0:5000 app
