#!/usr/bin/env bash
##############################################################################
#  INFINITE INDUSTRIES LOCAL DEV SETUP
#  ---------------------------------------
#  A script to help you get your local development environment up and running.
#
#   - Starts the Postgres Docker container.
#   - Starts the API server.
#   - Starts the Web Portal.
#   - Opens the web portal in your default browser.
#
#  Usage - From project root, run:
#    ./bin/setup.sh
#
#  Press Ctrl+C to stop all services and clean up.
##############################################################################

set -e

DB_CONTAINER_NAME="infinite-db"
DB_PORT="5436"
DB_USER="postgres"
DB_PASSWORD="xxx"
DB_NAME="infinite-api"
API_PORT="3003"
WEB_PORT="7779"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Function to cleanup everything when we're done
cleanup() {
    printf "\nShutting down Infinite Industries webapp...\n"

    # Stop API server and web portal
    jobs -p | xargs -r kill 2>/dev/null || true

    # Stop the database container
    docker stop "$DB_CONTAINER_NAME" 2>/dev/null || true
}

# Function to make sure db is ready to accept connections from API server
wait_for_db() {
    echo -n "Waiting for database..."
    until docker exec "$DB_CONTAINER_NAME" pg_isready -U "$DB_USER" > /dev/null 2>&1; do
        sleep 1
        echo -n "."
    done
    # DB was flaky running migrations on cold start, so give it a few seconds to really get going
    sleep 2
    echo " Database is ready :D"
}

# Function to detect OS and open the URL in the default browser
open_browser() {
    local URL="http://localhost:$WEB_PORT"
    if command -v open >/dev/null; then
        # macOS
        open "$URL"
    elif command -v xdg-open >/dev/null; then
        # Linux
        xdg-open "$URL"
    elif command -v start >/dev/null; then
        # Windows (Git Bash/WSL)
        start "$URL"
    else
        echo "Webapp ready at $URL"
    fi
}

# Function to wait for the web server to start responding, then opens the browser
wait_and_open_browser() {
    echo -n "Waiting for web portal to start..."
    # Use netcat to check if API port is open.
    if command -v nc >/dev/null; then
        until nc -z localhost "$API_PORT" 2>/dev/null; do
            sleep 1
            echo -n "."
        done
    else
        # Fallback: wait 5 seconds blindly
        sleep 5
    fi

    echo ""
    open_browser
}

# 0. Setup call to cleanup on exit
trap cleanup SIGINT SIGTERM

# 1. Start the database
# Check if it's started already
if docker ps -q -f name="$DB_CONTAINER_NAME" | grep -q .; then
    echo "Database is running..."
else
    # Try to start an existing container; if that fails, run a new one.
    if ! docker start "$DB_CONTAINER_NAME" 2>/dev/null; then
        docker rm -f "$DB_CONTAINER_NAME" 2>/dev/null || true
        echo "Starting database ..."
        docker run --name "$DB_CONTAINER_NAME" \
          --rm \
          -p "$DB_PORT":5432 \
          -e POSTGRES_USER="$DB_USER" \
          -e POSTGRES_PASSWORD="$DB_PASSWORD" \
          -e POSTGRES_DB="$DB_NAME" \
          -d postgres:9.6.2-alpine
    fi
fi

# 1.5 Wait for db to be ready to accept connections
wait_for_db

# 2. Start API server
(cd "$PROJECT_ROOT/api-server"
    if [ ! -d "node_modules" ]; then
        npm install
    fi
    npx sequelize-cli db:migrate
    npm run copy-constants
    echo "Starting API server..."
    npm run start:dev
) &

# 3. Start the web portal
(cd "$PROJECT_ROOT/web-portal"
    if [ ! -d "node_modules" ]; then
        npm install
    fi
    echo "Starting web portal..."
    npm run start:dev
) &

wait_and_open_browser &

echo "All services started. Press Ctrl+C to stop."

# Keep script running to call cleanup
wait
