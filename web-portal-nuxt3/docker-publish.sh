#!/usr/bin/env bash
FORCE=${FORCE:=""}

if [ -z "$FORCE" ]; then
cat << 'EOF'
It should not be neccesary to run this script: there is a Github workflow to
publish our containers:

  https://github.com/infinite-industries/infinite/actions/workflows/publish-container-images.yml

If you *really* want to run this script:

  FORCE=true ./docker-publish.sh

EOF
exit 1

fi

set -e

tag="${1:=local}"
container_name="infinite-industries/web-portal"
registry="ghcr.io"

push_to="$registry/$container_name:$tag"

echo "publishing $push_to"

docker tag "$container_name:$tag" "$push_to"

docker push "$push_to"

echo "published $push_to"

set +e
