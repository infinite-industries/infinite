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

# build a new image
build flags="":
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
fetchdb file="infinite-prod.anon.gz":
  aws s3 cp s3://infinite-industries-backups/db/{{ file }} .
  gunzip -f {{file}}

# populate database
populatedb file="infinite-prod.anon":
  psql $PGDATABASE < {{ file }}  
