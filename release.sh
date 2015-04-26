rm -rf all.tar.gz
tar -czf all.tar.gz public views routes koa.js config.js
scp -r all.tar.gz  root@vpn:/var/www/aboutbtc/
ssh -t root@vpn "cd /var/www/aboutbtc/ && tar -zvxf all.tar.gz"
rm -rf all.tar.gz
