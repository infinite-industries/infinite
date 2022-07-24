Build System
================

We use github actions to run tests against PRs

## Deploying/Publishing

Docker images can also be deployed using github actions. These actions must be ran manually.

## Troubleshooting

You can use the github cli to test these out before are added to main.

example: `gh workflow run "publish-to-docker-hub.yml" --ref publish-to-docker-hub -f commit=publish-to-docker-hub`