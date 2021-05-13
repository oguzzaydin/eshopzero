
FROM node:12.16.1-buster

# Avoid warnings by switching to noninteractive
ENV DEBIAN_FRONTEND=noninteractive

# Configure apt and install packages
RUN apt-get update \
    && apt-get -y install --no-install-recommends apt-utils dialog libicu63 libssl1.1 2>&1 \
    #
    # Verify wget, jq, unzip, git and process tools installed
    && apt-get -y install git iproute2 procps wget unzip jq yarn \
    #
    # Install Docker CE CLI
    && apt-get install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common lsb-release \
    && curl -fsSL https://download.docker.com/linux/$(lsb_release -is | tr '[:upper:]' '[:lower:]')/gpg | (OUT=$(apt-key add - 2>&1) || echo $OUT) \
    && add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/$(lsb_release -is | tr '[:upper:]' '[:lower:]') $(lsb_release -cs) stable" \
    && apt-get update \
    && apt-get install -y docker-ce-cli \
    #
    # Install Docker Compose
    && curl -sSL "https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose \
    && chmod +x /usr/local/bin/docker-compose \
    #
    # Install ngrok
    && curl --silent https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip --output /usr/local/bin/ngrok.zip \
    && unzip /usr/local/bin/ngrok.zip -d /usr/local/bin/ \
    #
    # yarn install
    && rm -rf ~/.yarn \
    && curl -o- -L https://yarnpkg.com/install.sh | bash \
    # Yarn configurations
    && export PATH="$HOME/.yarn/bin:$PATH" \
    && yarn config set prefix ~/.yarn -g  \
    #
    # Install global tools
    && npm i -g npm-check-updates \
    #
    # [Optional] Add sudo support for the non-root user
    && apt-get install -y sudo \
    #
    # Clean up
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# Switch back to dialog for any ad-hoc use of apt-get
ENV DEBIAN_FRONTEND=

CMD ["bash"]