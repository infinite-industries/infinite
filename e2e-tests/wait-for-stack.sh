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
