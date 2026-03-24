# STAGE 1: Development (The "Heavy" part where we build the code)
FROM node:20-alpine AS development

WORKDIR /usr/src/app

# Copy from the ROOT of your repo
COPY ./payment-service/package*.json ./
RUN npm install

# Copy service code and shared logic
COPY ./payment-service .
COPY ./shared ../shared

# Compile NestJS
RUN npm run build

# STAGE 2: Production (The "Light" part that actually runs on EKS)
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Copy ONLY the compiled code and modules from the development stage
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY --from=development /usr/src/shared ../shared 

# Standard production settings
ENV NODE_ENV=production
EXPOSE 3005

CMD ["node", "dist/main"]

