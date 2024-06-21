FROM rust:1.78.0 AS builder

RUN apt-get update && \
    apt-get install -y wget curl xz-utils libpq-dev git gh && \
    rm -rf /var/lib/apt/lists/*

RUN echo "Package: nodejs" >> /etc/apt/preferences.d/preferences && \
    echo "Pin: origin deb.nodesource.com" >> /etc/apt/preferences.d/preferences && \
    echo "Pin-Priority: 1001" >> /etc/apt/preferences.d/preferences

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

RUN rustup component add rustfmt
RUN rustup component add clippy

RUN cargo install diesel_cli --no-default-features --features postgres