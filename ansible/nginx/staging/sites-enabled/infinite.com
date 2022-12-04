server {
  listen 80;
  server_name staging.infinite.industries;

  if ($host = staging.infinite.industries) {
    return 301 https://$host$request_uri;
  }

  location /.well-known/acme-challenge/ {
    root /var/www/certbot;
  }
}

server {
    server_name staging.infinite.industries;

    listen 443 ssl;
    server_name staging.infinite.industries;

    ssl_certificate /etc/letsencrypt/live/staging.infinite.industries/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/staging.infinite.industries/privkey.pem;

    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $http_host;
            proxy_set_header X-NginX-Proxy true;

            proxy_pass http://localhost:7779;
            proxy_redirect off;

            proxy_pass_header Authorization;
            proxy_set_header Authorization $http_authorization;
            proxy_pass_header  Authorization;

            proxy_read_timeout 600;
            proxy_connect_timeout 600;
            proxy_send_timeout 600;
    }

    client_max_body_size 252M;
    client_body_buffer_size 252M;
    keepalive_timeout 10;
}
