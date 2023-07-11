FROM mcr.microsoft.com/devcontainers/javascript-node:0-16

RUN apt-get update \
  && apt-get install -y postgresql-client tmux zsh neovim ansible

RUN curl --proto '=https' --tlsv1.2 -sSf https://just.systems/install.sh | bash -s -- --to /usr/local/bin

RUN cd /tmp \
  && curl -sSf -o awscliv2.zip https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip \
  && unzip -q awscliv2.zip \
  && sudo ./aws/install --update \
  && rm -rf awscliv2 aws
