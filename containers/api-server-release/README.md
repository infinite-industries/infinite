To expose host ip to docker

```
HOS1T_IP=`ip -4 addr show scope global dev docker0 | grep inet | awk '{print \$2}' | cut -d / -f 1` \
docker run --add-host outside:$HOST_IP -p 3003:3003 -d \
--name infinite-web-portal \
--env POSTGRES_USER = $POSTGRES_USER \
--env POSTGRES_PW = $POSTGRES_PW \
--env POSTGRES_HOST = $POSTGRES_HOST \
--env POSTGRES_DB = $POSTGRES_DB \
--env POSTGRES_PORT = $POSTGRES_PORT \
--env SLACK_WEBHOOK_TEST = $SLACK_WEBHOOK_TEST \
--env SLACK_WEBHOOK_CONTACT = $ \
--env SLACK_WEBHOOK_EVENT_SUBMISSION = $SLACK_WEBHOOK_EVENT_SUBMISSION \
--env SLACK_WEBHOOK_VENUE_SUBMISSION = $SLACK_WEBHOOK_VENUE_SUBMISSION \
--env BITLY_TOKEN = $BITLY_TOKEN \
--env APP_URL = $APP_URL
```