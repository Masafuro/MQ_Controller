FROM nginx:alpine

COPY frontend/ /usr/share/nginx/html/
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
