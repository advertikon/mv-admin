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
docker build -t "${LATEST}" .

echo " ✔ Deploying image to ECR"
docker push "$TAGGED"
docker push "$LATEST"

echo " ✔ Registering new task definition"
SED_REPLACEMENT="s/VERSION/$PACKAGE_VERSION/"
aws ecs register-task-definition --cli-input-json "$(sed $SED_REPLACEMENT task-definition.json)"
echo " ✔ Updating service $SERVICE_NAME inside cluster $CLUSTER_NAME to use new latest version of task definition family $TASK_DEFINITION_NAME"
aws ecs update-service --cluster "$CLUSTER_NAME" --service "$SERVICE_NAME" --task-definition "$TASK_DEFINITION_NAME"
