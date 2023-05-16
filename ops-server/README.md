# ops

A minimal image for running Linux CLI utilities - shell scripts and similar.

## Quickstart

```console
$ docker run -ti --rm ghcr.io/infinite-industries/ops bin/db-backup
```

## Utilities

### db-backup

Source: [bin/db-backup](ctx/home/bin/db-backup] 

Use pg_dump to create a backup of a postres database. 

```
Usage: db-backup [flags]

Flags:
  -h                      display this help
  -n                      dry run: do not perform geocoding lookup- just print url

Environment:
  BACKUP_DIR   Directory to write backups. Default: /var/tmp
  NUM_BACKUPS  Number of backups to retain. Default: 10
  PGDATABASE
  PGHOST
  PGPORT
  PGUSER
  PGPASSWORD

Description: 

This script is meant to be run via cron on a periodic (daily) basis.  It uses
pg_dump to create a backup of a postgres database.  

Each backup will have a name like <database>-<date>:
  database - PGDATABASE
  date     - date --iso-8601=seconds (2023-02-25T22:42:16-05:00)

A symlink, latest, points to the latest backup.

NUM_BACKUPS (default 10) will be retained.

```
