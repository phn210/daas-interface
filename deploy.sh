#!/bin/sh

# variables
IMAGE_NAME="trava-governance-app-ui"
CONTAINER_NAME="trava-governance-app-container"
PRE="trava-governance-app"
HOST_PORT=3007

if [ "$1" ]; then
    HOST_PORT=$1
fi

if [ "$(docker images -q $IMAGE_NAME:latest)" ]; then
    docker image tag $IMAGE_NAME:latest $IMAGE_NAME-old:latest
    docker rmi $IMAGE_NAME:latest
fi

# build image
docker build --tag $IMAGE_NAME .

# stop & remove container
if [ "$(docker ps -aq -f status=running -f name=$CONTAINER_NAME)" ]; then
    docker stop $CONTAINER_NAME
fi

if [ "$(docker ps -aq -f status=exited -f name=$CONTAINER_NAME)" ]; then
    docker rm $CONTAINER_NAME
fi

# remove old image
if [ "$(docker images -q $IMAGE_NAME-old:latest)" ]; then
    # remove old image
    docker rmi $IMAGE_NAME-old:latest
fi

# restart
echo "$PRE: Restarting service"
docker run -d -p $HOST_PORT:80 --name $CONTAINER_NAME $IMAGE_NAME

docker ps
