Infinite Ansible Scripts
===========================

This is a trimmed down version of the rats ansible meant for quick experimentation

## Requirements

Ansible must be installed on the machine that runs these scripts.

Current versions:
  * ansible-core@2.12.6
  * python 3.10.4
  
You will need your public key deployed to the host for ssh access

You may need to connect to the host once with ssh to make sure it's in your list of known hosts

## Before Running

Create secret files under secrets-[env]:

* 1nfinite.pem (The pem obtained from auth0)
* web-portal.env (env file with the required environment values for the web-portal service)
* api.env (env file with the required environment values for the api service)

## Running

`ansible-playbook ./base_playbook.yml`

## First Time Setup

**These steps only needs to happen once**

After running ansible you will need to ssh into the machine and run:

* `sudo certbot certonly --nginx` [from: https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal]
    * enter: infinite.industries,api.infinite.industries (or staging.infinite.industries,staging-api.infinite.industries if this is for staging)

## Run Next Playbook

`ansible-playbook ./deploy_site_playbook.yml`

* ssh into the machine (`ssh infinite@infinite.industries`)
* cd to `./docker-files` and run `docker-compose up -d`
* run `sudo systemctl restart nginx`

## Adding Domains to SSH certs

If you later want to direct additional sub-domains you can run:

```
sudo certbot certonly \
  -d infinte.com \
  -d api.infinite.industries \
  -d new-sub.infinite.industries
```

## Manually updating certs

`sudo certbot renew`

*This shouldn't normally be required because certbot will keep these up to date, but it may be required in staging
occasionally because we turn the server off when not in use*

**Deploy The Site**

Now run `ansible-playbook  --extra-vars "ansible_sudo_pass=$INFINITE_SUDO_PW" ./deploy_site_playbook.yml`

*You can run this again in the future after updates to nginix config or docker-compose*


### TODO

image tag docker-compose.yml is hard coded to development, that should be master if deploying prod
