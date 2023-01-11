#!/usr/bin/env bash

set -o errexit
set -o nounset

set-environment(){
  POSTGRES_USER="${POSTGRES_USER:=postgres}"
  POSTGRES_PASSWORD="${POSTGRES_PASSWORD:?xxx}"
  DB_HOST="${DB_HOST:=localhost}"
  DB_PORT="${DB_PORT:=5432}"
  POSTGRES_DB="${POSTGRES_DB:=infinite-api}"
}

usage(){
  cat <<EOF
Perform DB migrations via `npm run db:migrate`
Usage: migrate.sh [-h] [-e env_file] [<db_connection_string>]

Flags:
  -h                      display this help
  -e <env_file>           read environment variables from a file. Any variables defined this
                          way override otherwise set variables.
  <db_connection_string>  override the db connection string set via environment variables. the string is in 
                          the form: "postgres://username:password@hostname:port/db"

Environment: 
  * POSTGRES_USER=${POSTGRES_USER}
  * POSTGRES_PASSWORD=xxx
  * DB_HOST=${DB_HOST}
  * DB_PORT=${DB_PORT}
  * POSTGRES_DB=${POSTGRES_DB}

EOF
}

fail() {
  echo $1 >&2
  exit 1
}

init() {

  set-environment

  OPTIND=1

  while getopts "h?e:" opt; do
      case "$opt" in
      h|\?)
        usage
        exit 0
        ;;
      e)
        env_file=$OPTARG
        if [[ ! -r ${env_file} ]]; then
          fail "env file ${env_file} is can not be read"
        fi 
        export $(grep -v '^#' ${env_file} | xargs)
        ;;
      esac
  done

  shift $((OPTIND-1))
  
  if [[ $# -gt 1 ]]; then
    DB_CONNECTION=$1
  fi

  DB_CONNECTION="postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DB_HOST}:${DB_PORT}/${POSTGRES_DB}"                                                   
}


main() {
  init $*

  npm run db:migrate -- --url "${DB_CONNECTION}"

}

main $*
