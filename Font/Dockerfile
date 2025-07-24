# 1. Use lightweight nginx image
FROM nginx:alpine

# 2. Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# 3. Copy built dist/ into nginx html folder
COPY dist/ /usr/share/nginx/html

# 4. Copy custom nginx config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port (default 80)
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
