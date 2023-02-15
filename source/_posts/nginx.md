---
title: linux下安装nginx
date: 2022-08-18
tags: linux
categories: 前端得懂的运维技能
---
作为一个前端，阿里云买台服务器能干啥，可以搭建一下自己的个人博客。首先需要安装个nginx
## 1.我是如何安装的
找了一种最简单的方式，傻瓜式的自动安装依赖
```zsh
yum install nginx
```
## 2.nginx的基本命令
启动服务：nginx

退出服务：nginx -s quit

强制关闭服务：nginx -s stop

重载服务：nginx -s reload（重载服务配置文件，类似于重启，但服务不会中止）

验证配置文件：nginx -t （可以查看配置文件的所在位置及状态）<br>
ngint -t 会看到以下两句
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

## 3.修改配置文件
vim /etc/nginx/nginx.conf

配置文件的内容如下，在项目使用中，使用最多的三个核心功能是静态服务器、反向代理、负载均衡。均是通过修改配置文件实现。
```
# For more information on configuration, see:
#   * Official English Documentation: http://nginx.org/en/docs/
#   * Official Russian Documentation: http://nginx.org/ru/docs/

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 4096;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

    server {
        listen       80;
        listen       [::]:80;
        server_name  _;
        root         /usr/share/nginx/html;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }

# Settings for a TLS enabled server.
#
#    server {
#        listen       443 ssl http2;
#        listen       [::]:443 ssl http2;
#        server_name  _;
#        root         /usr/share/nginx/html;
#
#        ssl_certificate "/etc/pki/nginx/server.crt";
#        ssl_certificate_key "/etc/pki/nginx/private/server.key";
#        ssl_session_cache shared:SSL:1m;
#        ssl_session_timeout  10m;
#        ssl_ciphers PROFILE=SYSTEM;
#        ssl_prefer_server_ciphers on;
#
#        # Load configuration files for the default server block.
#        include /etc/nginx/default.d/*.conf;
#
#        error_page 404 /404.html;
#            location = /40x.html {
#        }
#
#        error_page 500 502 503 504 /50x.html;
#            location = /50x.html {
#        }
#    }

}
```
作为初步使用先不修改了，可以把自己的项目部署到/usr/share/nginx/html/下就可以访问了。

如果修改了静态服务的部署目录，再次访问页面会出现403forbidden，这时需要把nginx配置文件中的user nginx改为root就可以了。
