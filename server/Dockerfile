# DEPENDENCIES
FROM node:16-alpine as deps
RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --pure-lockfile

# BUILDER
FROM node:16-alpine as builder
WORKDIR /app
COPY ./ ./
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build

# RUNNER
FROM node:16-alpine as runner
WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S runner -u 1001
USER runner
EXPOSE 3000

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env* ./
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

ENV PORT=3000
ENV NODE_ENV=production
ENV JET_LOGGER_MODE=CONSOLE

CMD ["node", "-r", "module-alias/register", "./dist"]
