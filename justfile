set dotenv-load

tag := env_var_or_default("IMAGE_TAG","latest")
name := env_var("IMAGE_NAME")
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
    && docker build -t {{name}}:{{tag}} {{flags}} -f Dockerfile {{ ctx }}

_login:
  @ echo "${{ registry_pass_var }}" | docker login {{registry}} -u {{registry_user}} --password-stdin

_logout:
  @ docker logout {{registry}}

# publish the image
publish alt_tag=tag: _login
  docker tag {{name}}:{{tag}} {{registry}}/{{name}}:{{alt_tag}}
  docker push {{registry}}/{{name}}:{{alt_tag}}
  docker logout {{registry}}
