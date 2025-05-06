FROM node:20-alpine AS base
#install dependencies
FROM base AS installer
RUN apk update
WORKDIR /app
COPY ./package-lock.json ./
COPY ./package.json ./
RUN npm install
#build the app
FROM installer AS builder
WORKDIR /app
COPY . .
RUN npm run build
#run the app
FROM base AS runner
WORKDIR /app
COPY . /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=installer /app/package.json ./package.json
COPY --from=installer /app/package-lock.json ./package-lock.json
COPY --from=installer /app/node_modules ./node_modules
#expose the port
EXPOSE 3000
CMD ["npm", "run", "start"]