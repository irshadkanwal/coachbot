FROM node:20-slim

ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

ARG NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID
ENV NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID=$NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID

RUN apt update && apt install -y \
    openssl \
    git

RUN mkdir /home/node/app/
COPY . /home/node/app/
WORKDIR /home/node/app/

RUN npm clean-install --legacy-peer-deps
RUN npm run build

RUN chown -R node:node /home/node
USER node

CMD ["npm", "run", "start"]
