#!/bin/sh

echo "🔧 Injection de API_BASE_URL..."
find /usr/share/nginx/html -name "*.js" -exec sed -i "s|#{API_BASE_URL}#|${API_BASE_URL}|g" {} \;

echo "🚀 Démarrage nginx..."
exec nginx -g "daemon off;"
