# TODO
* PORT must be sent - DEFAULT_PORT is ignored

* Update start script to take some arguments?
  * default - start the service
  * migrate - migrage / populate the database

* Makefile to replace various scripts:
  * docker-build - build the image
  * docker-publish - publish image to dockerhub
  * docker-run - run the server, attach to local db

* replace these w/ docker-compose?
  * `docker-run.sh`   - api server, attach to local db
  * `docker-start-local-db.sh `- start db in a container
  * `startOrRestartFreshDb.sh` - starts a fresh database

* remove `wait-for-it.sh`
  * just assume the database is up -- assuming the database image is changed to include a healthcheck.

# NOTES
* Wrapping docker-compose w/ Makefile example: https://medium.com/freestoneinfotech/simplifying-docker-compose-operations-using-makefile-26d451456d63
* Example docker-compose.yml files:
  * sonatype/ossrsh-proxy has a reasonable starting docker-compose.yml file (builds image)
  * links.ng/docker-compose.yml

* Perhaps use `just` rather than `make`? 
  * https://just.systems/man/en/chapter_21.htmlhttps://just.systems/man/en/chapter_21.html
  * We don't need make build deps, etc - just a quick way to wrap tasks.
 
* Shall we count the ways in which the .env file is being used?


