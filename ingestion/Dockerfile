# Dockerfile for Rust ingestion app
FROM rust:1.81 AS builder

WORKDIR /app

# Copy Cargo.toml and Cargo.lock (if exists) before running `cargo build` to cache dependencies.
COPY Cargo.toml .
COPY Cargo.lock .
RUN cargo fetch

# Now copy the entire source code
COPY . .

# Build the release version
RUN cargo build --release

# Run the binary
CMD ["./target/release/ingestion"]
