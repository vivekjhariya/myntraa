# stage 1: Build

# pull node image with alpine linux
FROM node:26-alpine AS builder

# create a non-root user to run the application
RUN addgroup -g 10001 -S appgroup && \
    adduser -u 10001 -S -G appgroup -h /app -D appuser

# set working directory
WORKDIR /app

# copy package.json and package-lock.json to the working directory
COPY package*.json ./

# install dependencies
RUN npm ci 

# copy the rest of the application code to the working directory
COPY --chown=appuser:appgroup . .

# build the application
RUN npm run build

# remove dev dependencies to reduce the image size
RUN npm prune --omit=dev \
    && rm -rf node_modules/@esbuild \
           node_modules/esbuild \
           node_modules/vite \
           node_modules/@vitejs \
           node_modules/typescript \
           node_modules/tsx \
           node_modules/.cache \
 && npm cache clean --force
    

# create output directory and copy the built frontend, API, dependencies, and
# package metadata required by the production server
RUN mkdir -p /output && \
    cp -r dist node_modules package*.json server.js server /output/ && \
    chown -R 10001:10001 /output

# stage 2: Runtime

# pull distroless node image
FROM gcr.io/distroless/nodejs26-debian13

# create a working directory for the application
WORKDIR /app

# copy the built application and dependencies from the builder stage to the working directory
COPY --from=builder /output/ ./

# set the user to run the application
USER 10001:10001

# set environment variables and expose the application port
ENV NODE_ENV=production
EXPOSE 3001

# server.js serves the Vite dist directory and exposes the Express API
CMD ["server.js"]

