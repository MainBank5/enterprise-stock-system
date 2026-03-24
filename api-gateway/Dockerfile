# 1. Base image
FROM node:20-alpine AS development

# 2. Set the working directory INSIDE the container
WORKDIR /usr/src/app

# 3. Copy package files from the ROOT context
COPY ./api-gateway/package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the service code
COPY ./api-gateway .

# 6. Copy the SHARED folder (Crucial for events)
# This copies the local 'shared' folder to a 'shared' folder inside the container
COPY ./shared ../shared

# 7. Build the NestJS app
RUN npm run build

# 8. Production Stage
FROM node:20-alpine AS production
WORKDIR /usr/src/app
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/node_modules ./node_modules
# We also need the shared folder in the final image if it's a dependency
COPY --from=development /usr/src/shared ../shared 

# Set the environment to production
ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main"]
