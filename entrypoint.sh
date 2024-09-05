#!/bin/bash

DOMAIN="zamcv.com"
CERT_DIR="/usr/src/app/backend/cert"
EMAIL="hello@zamcv.com"

mkdir -p $CERT_DIR

if [ ! -f "$CERT_DIR/cert.pem" ] || [ ! -f "$CERT_DIR/key.pem" ]; then    
    certbot certonly --standalone --non-interactive --agree-tos \
        --cert-name $DOMAIN \
        --email $EMAIL \
        --domains $DOMAIN \
        --deploy-hook "cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $CERT_DIR/cert.pem && cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $CERT_DIR/key.pem"
    echo "Certificate obtained"
else
    echo "Certificate already exists"
fi

renew_certificates() {
    while true; do
        certbot renew --non-interactive --deploy-hook "cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $CERT_DIR/cert.pem && cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $CERT_DIR/key.pem"
        
        sleep 12h
    done
}

renew_certificates &

echo "Starting app"
exec app
