#!/bin/bash

mkdir -p /var/www/certbot
mkdir -p /etc/letsencrypt
chown -R www-data:www-data /var/www/certbot

mv /etc/nginx/nginx.conf.init /etc/nginx/nginx.conf
nginx

sleep 60

certbot certonly --webroot -w /var/www/certbot -d hackmx.mx --email admin@hackmx.mx --agree-tos -n --keep-until-expiring

if [ -f /etc/letsencrypt/live/hackmx.mx/fullchain.pem ] && [ -f /etc/letsencrypt/live/hackmx.mx/privkey.pem ]; then
    cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.init
    mv /etc/nginx/nginx.conf.start /etc/nginx/nginx.conf
    
    nginx -s reload
else
    echo "No se pudo obtener el certificado SSL. Verifique los logs para más detalles."
fi

/usr/local/bin/app