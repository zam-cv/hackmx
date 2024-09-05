FROM rust:latest AS builder

WORKDIR /usr/src/app

ENV MODE=production

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
    apt-get install -y libpq-dev certbot && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/src/app/target/release/backend /usr/local/bin/app
COPY --from=builder /usr/local/cargo/bin/diesel /usr/local/bin/diesel

WORKDIR /usr/src/app/backend

COPY backend/page ./page

EXPOSE 80 443

ENTRYPOINT ["app"]