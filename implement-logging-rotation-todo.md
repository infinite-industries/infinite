# Logging Rotation & Persistence Plan

## Problem

Docker container logs grow unbounded between deploys and are lost entirely on redeploy.
This plan adds local log rotation (Phase 1) and durable off-box log storage via Azure Monitor (Phase 2).

---

## Phase 1: Docker Log Rotation

Configures Docker's built-in `json-file` log driver to rotate logs automatically.
This stops unbounded growth and preserves local access via `docker-compose logs`.

### Implementation

Edit `ansible/docker-files/docker-compose.yml` and add a `logging` block to each service:

```yaml
services:
  api-server:
    image: "ghcr.io/infinite-industries/api-server:${INFINITE_IMAGE_VERSION_TAG:-master}"
    restart: always
    env_file:
      - ./api.env
    volumes:
      - ./keys:/api-server/keys
    expose:
      - "3003"
    ports:
      - "3003:3003"
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "5"

  web-portal:
    restart: always
    image: "ghcr.io/infinite-industries/web-portal:${INFINITE_IMAGE_VERSION_TAG:-master}"
    env_file:
      - ./web-portal.env
    environment:
      HOST: 0.0.0.0
      PORT: 7779
    depends_on:
      - api-server
    expose:
      - "7779"
    ports:
      - "7779:7779"
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "5"

  discord-bot:
    restart: always
    image: "ghcr.io/infinite-industries/discord-bot:${DISCORD_BOT_VERSION:-latest}"
    env_file:
      - ./discord-bot.env
    expose:
      - "2112"
    ports:
      - "2112:2112"
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "5"
```

Each service keeps up to 5 log files at 10MB each (~50MB per service, ~150MB total).
`docker-compose logs` continues to work as before.

### Deployment

Run the existing Ansible deploy playbook. The updated `docker-compose.yml` will be
copied to the host and the containers restarted, at which point the new logging
configuration takes effect.

---

## Phase 2: Azure Monitor / Log Analytics

Ships container logs to Azure Log Analytics for durable, searchable, off-box storage.
The 5 GB/month free ingestion tier and 31-day retention should be more than sufficient
for a small community app.

### Step 1: Create a Log Analytics Workspace

In the Azure portal:

1. Go to **Log Analytics workspaces** > **Create**
2. Select the resource group and region matching the VPS
3. Note the **Workspace ID** and **Primary Key** (under Agents management)

### Step 2: Install the Azure Monitor Agent

On the VPS (can be added as an Ansible task in `deploy_site_playbook.yml`):

```bash
wget https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh
sh onboard_agent.sh -w <WORKSPACE_ID> -s <PRIMARY_KEY> -d opinsights.azure.com
```

Or via Ansible:

```yaml
- name: Install Azure Monitor Agent
  become: true
  shell: |
    wget -q https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh -O /tmp/onboard_agent.sh
    sh /tmp/onboard_agent.sh -w {{ azure_log_workspace_id }} -s {{ azure_log_primary_key }} -d opinsights.azure.com
  args:
    creates: /opt/microsoft/omsagent
```

Store `azure_log_workspace_id` and `azure_log_primary_key` in `ansible/group_vars/prod/secrets`
(encrypted with Ansible Vault, consistent with the existing secrets pattern).

### Step 3: Configure Container Log Collection

In the Azure portal:

1. Go to the Log Analytics workspace > **Agents configuration** (Legacy)
2. Under **Data** > **Custom Logs** or use the built-in **Container Logs** solution
3. Alternatively, create a **Data Collection Rule** scoped to the VPS that collects
   Docker container logs from `/var/lib/docker/containers/*/*-json.log`

### Step 4: Verify

- Check agent health: `sudo /opt/microsoft/omsagent/bin/omsadmin.sh -l`
- In the Azure portal, go to the Log Analytics workspace > **Logs** and run:
  ```
  ContainerLog | take 10
  ```
- Confirm logs appear within a few minutes of generation

### How the Two Phases Work Together

```
Container stdout
  → Docker json-file driver (Phase 1: rotated locally, ~50MB per service)
      → docker-compose logs (immediate local access)
      → Azure Monitor Agent reads log files before rotation
          → Azure Log Analytics (Phase 2: 31-day searchable history)
```

Local rotation (Phase 1) keeps disk usage bounded.
Azure Monitor (Phase 2) provides durable history and KQL-based searching/alerting.
The local `max-size: 10m` with `max-file: 5` gives the agent plenty of buffer to
ship entries before they rotate out.

### Cost

- Phase 1: Free (built-in Docker feature)
- Phase 2: Free tier covers 5 GB/month ingestion + 31 days retention. For a small
  community app this should be sufficient. Monitor usage under the workspace's
  **Usage and estimated costs** blade.
