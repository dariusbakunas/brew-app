FROM node:8-alpine AS base

WORKDIR /app

COPY package.json npm-shrinkwrap.json ./

# ---- Dependencies ----
FROM base AS dependencies
# install node packages
RUN npm set progress=false && npm config set depth 0
RUN npm ci --only=production
# copy production node_modules aside
RUN cp -R node_modules prod_node_modules
# install ALL node_modules, including 'devDependencies'
RUN npm ci

# ---- Build, Test ----
FROM dependencies as build
COPY . .
RUN npm run test
RUN npm run build

# ---- Release ----
FROM base AS release
COPY --from=dependencies /app/prod_node_modules ./node_modules
COPY --from=build /app/dist ./dist
EXPOSE 4000
CMD npm run server:prod

