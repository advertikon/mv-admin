aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 124862800015.dkr.ecr.us-east-1.amazonaws.com
docker push 124862800015.dkr.ecr.us-east-1.amazonaws.com/admin-front:latest
