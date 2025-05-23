#!/bin/bash

DIR="$( cd "$( dirname "$0" )" && pwd )"
cd "$DIR"/..
set -e

if [ -z "$1" ]; then
  echo " ⛔  Next version number missing. Exit"
  exit 1
fi

if [ -z "$IMAGE" ]; then
    echo " ⛔  Image is not specified. Exit"
    exit 1
fi

PACKAGE_VERSION=$1
TAGGED="${IMAGE}:${PACKAGE_VERSION}"
LATEST="${IMAGE}:latest"

echo " ✔ Package version: ${PACKAGE_VERSION}"

echo " ✔ Building versioned image ${TAGGED}";
docker build -t "${TAGGED}" .
echo " ✔ Building latest image ${LATEST}";
docker tag "${TAGGED}" "${LATEST}"

echo " ✔ Deploying image to ECR"
docker push "$TAGGED"
docker push "$LATEST"

echo " ✔ Updating image in Kubernetes"
kubectl --insecure-skip-tls-verify set image -n prod deployment/mv-admin mv-admin=registry.staging.maxvehicle.com/mv-admin:"$PACKAGE_VERSION"
kubectl --insecure-skip-tls-verify rollout status deployment/mv-admin -n prod
