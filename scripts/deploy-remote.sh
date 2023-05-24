ssh -i /home/max/MEGAsync/project/advertikon/server_1vCPU.pem ubuntu@maxvehicle.com \
"aws ecr get-login-password --region us-east-1 | sudo docker login --username AWS --password-stdin 124862800015.dkr.ecr.us-east-1.amazonaws.com;\
sudo docker pull 124862800015.dkr.ecr.us-east-1.amazonaws.com/admin-front:latest;\
sudo docker-compose up -d --force-recreate --no-deps front-admin"

