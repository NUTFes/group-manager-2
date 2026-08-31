FROM rust:bookworm AS builder

ARG WEAVE_VERSION=v0.3.1

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates git \
  && rm -rf /var/lib/apt/lists/*

RUN cargo install --locked --git https://github.com/Ataraxy-Labs/weave --tag ${WEAVE_VERSION} weave-cli \
  && cargo install --locked --git https://github.com/Ataraxy-Labs/weave --tag ${WEAVE_VERSION} weave-driver

FROM debian:bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends bash ca-certificates git openssh-client \
  && rm -rf /var/lib/apt/lists/* \
  && mkdir -p /tmp/devtools-home

COPY --from=builder /usr/local/cargo/bin/weave /usr/local/bin/weave
COPY --from=builder /usr/local/cargo/bin/weave-driver /usr/local/bin/weave-driver

RUN git config --system merge.weave.name "Entity-level semantic merge" \
  && git config --system merge.weave.driver "weave-driver %O %A %B %L %P" \
  && chmod 777 /tmp/devtools-home

WORKDIR /workspace

CMD ["bash"]
