rm -rf all.tar.gz
tar -czf all.tar.gz public views routes models
scp -i ~/m2key.pem -r all.tar.gz  root@vpn.uuzcloud.com:~/vip/

# ssh  -i ~/m2key.pem -t root@cvp.cocoachina.com "cd vip/ && tar -zvxf all.tar.gz"
rm -rf all.tar.gz
