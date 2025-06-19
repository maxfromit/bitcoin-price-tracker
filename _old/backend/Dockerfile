FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# Build step is optional if you use ts-node, otherwise uncomment next line for tsc builds
# RUN yarn build

CMD ["yarn", "start"]