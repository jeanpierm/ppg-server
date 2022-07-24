#####################
#       BUILD       #
#####################
FROM node:16.16.0 as builder

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

RUN npm run build \
  && npm prune --production

USER node

#####################
#       RUN         #
#####################
FROM node:16.16.0

# necessary dependencies for chrmomium of puppeteer works
RUN apt-get update
RUN apt-get install -y \
  ca-certificates \
  fonts-liberation \
  gconf-service \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2  \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1  \
  libgbm1 \
  libgcc1 \
  libglib2.0-0 \
  libgbm-dev  \
  libgdk-pixbuf2.0-0  \
  libgtk-3-0  \
  libicu-dev  \
  libjpeg-dev  \
  libnspr4  \
  libnss3  \
  libpango-1.0-0  \
  libpangocairo-1.0-0  \
  libstdc++6 \
  libpng-dev  \
  libx11-6  \
  libx11-xcb1  \
  libxcb1  \
  libxcomposite1  \
  libxcursor1  \
  libxdamage1  \
  libxext6  \
  libxfixes3  \
  libxi6  \
  libxrandr2  \
  libxrender1  \
  libxss1  \
  libxtst6  \
  lsb-release \
  wget \
  xdg-utils

ENV NODE_ENV production

USER node
WORKDIR /usr/src/app

COPY --from=builder --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=node:node /usr/src/app/dist ./dist
COPY --from=builder --chown=node:node /usr/src/app/templates ./templates
COPY --from=builder --chown=node:node /usr/src/app/collections ./collections
COPY --from=builder --chown=node:node /usr/src/app/client ./client
COPY --from=builder --chown=node:node /usr/src/app/.env ./.env

# avoid permission erors
RUN chmod -R o+rwx node_modules/puppeteer/.local-chromium

EXPOSE 3000

CMD ["node", "dist/main.js"]