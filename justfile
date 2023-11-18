set dotenv-load

image_tag := env_var_or_default("IMAGE_TAG","latest")
image_name := env_var_or_default("IMAGE_NAME","")
registry := env_var_or_default('IMAGE_REGISTRY',"ghcr.io")

# this is the user used to authenticate with the registry
registry_user := "jswank"

# this environment variable will be passed to docker login as the password
registry_pass_var := "REGISTRY_PASSWORD"  

# this directory is used as the build context when constructing the image
ctx := "."

# build all the docker images
build-all-images flags="":
  cd api-server && just build-image
  cd web-portal && just build-image
  cd ops-server && just build-image

# build a new image
build-image flags="":
  cd {{ invocation_directory() }} \
    && docker build -t {{image_name}}:{{image_tag}} {{flags}} -f Dockerfile {{ ctx }}

_login:
  @ echo "${{ registry_pass_var }}" | docker login {{registry}} -u {{registry_user}} --password-stdin

_logout:
  @ docker logout {{registry}}

# publish the image
publish alt_tag=image_tag: _login
  docker tag {{image_name}}:{{image_tag}} {{registry}}/{{image_name}}:{{alt_tag}}
  docker push {{registry}}/{{image_name}}:{{alt_tag}}
  docker logout {{registry}}

# retrieve latest database backup
fetchdb file="sanitized-infinite-prod.latest":
  aws s3 cp s3://infinite-industries-backups/db/{{ file }} .

# populate database
populatedb file="sanitized-infinite-prod.latest": fetchdb 
  PGPASSWORD=$PGPASSWORD pg_restore --clean --no-privileges --no-owner -v -d $PGDATABASE {{ file }}  

# you're looking at it!
help:
  @just --list 

