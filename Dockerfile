FROM rust:latest AS builder

WORKDIR /usr/src/app

COPY backend/migrations ./migrations
COPY backend/templates ./templates
COPY backend/Cargo.toml backend/Cargo.lock ./

RUN mkdir src && \
    echo "fn main() {}" > src/main.rs && \
    cargo build --release

RUN rm -f target/release/deps/backend*

COPY backend/src ./src

RUN cargo build --release --features production

RUN apt-get update && \
    apt-get install -y libpq-dev && \
    rm -rf /var/lib/apt/lists/*

RUN cargo install diesel_cli --no-default-features --features postgres

FROM debian:bookworm-slim

RUN apt-get update && \
    apt-get install -y --reinstall ca-certificates && \
    apt-get install -y libpq-dev certbot nginx cron && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/src/app/target/release/backend /usr/local/bin/app
COPY --from=builder /usr/local/cargo/bin/diesel /usr/local/bin/diesel

RUN echo "0 0,12 * * * certbot renew --nginx --quiet" | crontab -

WORKDIR /usr/src/app/backend

COPY nginx.conf.init /etc/nginx/nginx.conf.init
COPY nginx.conf.start /etc/nginx/nginx.conf.start
RUN mkdir -p /etc/nginx/ssl
COPY backend/page ./page

EXPOSE 80 443

COPY start.sh /usr/src/app/start.sh
RUN chmod +x /usr/src/app/start.sh

CMD ["/usr/src/app/start.sh"]