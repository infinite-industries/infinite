# waits for 5 minutes (60 retries on 5-second intervals)
limit=60
interval=5

service_trials=0

printf 'wait for api service\n'

until $(curl --output /dev/null --silent --head --fail http://localhost:3003/version); do
    printf "...waiting %s \n" "$service_trials"
    ((service_trials=service_trials+1))

    if [ $service_trials -gt $limit ]; then
      printf "ERROR: Timed out waiting for api\n"
      exit 1
    fi

    sleep $interval
done

printf '...found service!\n'
# troubleshooting -- ensure the API server is _actually_ up, and not spitting back an error
curl --silent --fail http://localhost:3003/version

# now try the web portal
service_trials=0
printf "wait for web portal\n"
until $(curl --output /dev/null --silent --head --fail http://localhost:7779); do
    printf "...waiting %s\n" "$service_trials"
    ((service_trials=service_trials+1))
    if [ $service_trials -gt $limit ]; then
        printf "ERROR: Timed out waiting for web portal\n"
        exit 1
    fi

    sleep $interval
done

printf '...found portal!\n'
