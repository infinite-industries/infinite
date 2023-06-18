## Copying the production data

---
There is a scheduled, nightly backup of the database.  The most recent copy 
is available to team members.

```console
$ scp infinite-industries:backups/infinite-prod.latest .
```
---

**Making a DB dump via an SSH tunnel:**

First establish a tunnel to allow access to the database locally

This assumes your public key has been given granted access to the host

```
ssh -L 5556:"infinite-api-production.postgres.database.azure.com":5432 \
    ubuntu@infinite.industries
```

Now dump the data

```
PGPASSWORD=[pw] pg_dump \
    -Fc -v -h localhost \
    --port=5556 \
    --username=infinite@infinite-api-production \
    --dbname=infinite-api \
    -f ./infinite-staging-dump
```

**To Restore to another database**

```
PGPASSWORD=[pw_for_new_db] pg_restore \
    -v --no-owner --host=localhost \
    --port=5436 \
    --username=[new_db_name] \
    --dbname=infinite-api \
    ./infinite-prod.latest
```

If you wanted to restore this to a local db it may be convenient to run one in docker like this:

```
docker run --name infinite-db \
    -p 5436:5432 \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=xxx \
    -e POSTGRES_DB=infinite-api \
    -d postgres:9.6.2-alpine
```
