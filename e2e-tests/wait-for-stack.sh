# waits for 5 minutes (30 retries on 10-second intervals)
limit=30

service_trials=0

printf 'wait for api service\n'

until $(curl --output /dev/null --silent --head --fail http://localhost:3003/version); do
    printf "...waiting %s \n" "$service_trials"
    ((service_trials=service_trials+1))

    if [ $service_trials -gt $limit ]; then
      printf "ERROR: Timed out waiting for api\n"
      exit 1
    fi

    sleep 10
done

printf '...found service!\n'
