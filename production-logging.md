# Production Logging

## Overview

Container logs are managed by Docker's built-in `json-file` log driver with rotation enabled. This prevents unbounded
disk growth while keeping recent logs accessible.

## Configuration

Each service in `ansible/docker-files/docker-compose.yml` has the following logging block:

```yaml
logging:
  driver: json-file
  options:
    max-size: "1m"
    max-file: "5"
```

This keeps up to 5 rotated log files at 1MB each per service (~5MB per service, ~15MB total across all services).

## Viewing Logs

Connect to the server: `ssh infinite@infinite.industries`

Change to the docker-files directory: `cd ./docker-files`

Use `docker-compose logs` as usual — it reads across all rotated files automatically.

```bash
# all services
docker-compose logs

# single service, follow mode
docker-compose logs -f api-server
```

## Log Location on Disk

Docker stores the log files at:

```
/var/lib/docker/containers/<container-id>/<container-id>-json.log
```

To find the log path for a specific container:

```bash
docker inspect --format='{{.LogPath}}' <container_name_or_id>
```
