FROM node:19-alpine

RUN apk add --no-cache libpcap-dev
RUN ln -s /usr/lib/libpcap.so.1 /usr/lib/libpcap.so.0.8

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

RUN chmod +x ./dist/index.js
CMD ["node", "./dist/index.js"]