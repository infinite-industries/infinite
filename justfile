set dotenv-load

image_tag := env_var_or_default("IMAGE_TAG","latest")
image_name := env_var_or_default("IMAGE_NAME", "infinite-industries/" + file_name(invocation_directory()))
registry := env_var_or_default('IMAGE_REGISTRY',"ghcr.io")

# this is the user used to authenticate with the registry
registry_user := "jswank"

# this environment variable will be passed to docker login as the password
registry_pass_var := "REGISTRY_PASSWORD"  

# this directory is used as the build context when constructing the image
ctx := "."

# build and run within docker
build-and-run: build-all-images run

# run environment via docker-compose
run: 
  docker-compose up

# build all the docker images
build-all-images flags="":
  cd api-server && just build-image
  cd web-portal && just build-image
  cd ops-server && just build-image

# build a new image
build-image flags="":
  cd {{ invocation_directory() }} \
    && docker build -t {{image_name}}:{{image_tag}} {{flags}} -f Dockerfile {{ ctx }}

  # tag w/ default registry
  docker tag {{image_name}}:{{image_tag}} {{registry}}/{{image_name}}:{{image_tag}}

_login:
  @ echo "${{ registry_pass_var }}" | docker login {{registry}} -u {{registry_user}} --password-stdin

_logout:
  @ docker logout {{registry}}

# Usage: publish [alt_tag]
# 
# Publish the image to the registry. If alt_tag is specified, then the
# registry image will have that tag.
#
# Examples:
#    publish         - publish image image_name:image_tag to the registry
#
#    publish alt_tag - publish the image image_name:image_tag to the registry
#                      as image_name:alt_tag
#
# Publish the image
publish alt_tag=image_tag: _login
  docker tag {{image_name}}:{{image_tag}} {{registry}}/{{image_name}}:{{alt_tag}}
  docker push {{registry}}/{{image_name}}:{{alt_tag}}
  docker logout {{registry}}

# Display this listing. Detailed help is available with 'help recipe_name'.
help recipe="help":
  #!/bin/sh
  if [ "{{recipe}}" = "help" ]; then
    just --list --justfile {{justfile()}}
  else
    grep -B 32 -E '^@?{{recipe}}\s?.*:' {{justfile()}} \
      | tac |  awk 'NR==1 {print; next}; !/^#/{exit}1;' | tac
  fi

# retrieve latest database backup
fetchdb file="sanitized-infinite-prod.latest":
  aws s3 cp s3://infinite-industries-backups/db/{{ file }} .

# populate database
populatedb file="sanitized-infinite-prod.latest": fetchdb 
  PGPASSWORD=$PGPASSWORD pg_restore --clean --no-privileges --no-owner -v -d $PGDATABASE {{ file }}  
