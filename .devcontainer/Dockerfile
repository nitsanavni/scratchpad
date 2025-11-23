FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

# Install additional tools
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    tmux \
    fzf \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Bun (use vscode user instead of root for devcontainer)
USER vscode
RUN curl -fsSL https://bun.sh/install | bash

# Install Claude Code globally with Bun
RUN /home/vscode/.bun/bin/bun install -g @anthropic-ai/claude-code

USER root
