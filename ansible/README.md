# Infinite Ansible Scripts

This is a trimmed down version of the rats ansible meant for quick experimentation

## Requirements

Ansible must be installed on the machine that runs these scripts.

Current versions:
  * ansible-core@2.12.6
  * python 3.10.4
  
You will need your public key deployed to the host for ssh access

You may need to connect to the host once with ssh to make sure it's in your list of known hosts

If you install [casey/just](https://github.com/casey/just), then some tasks
will be simplified.

## Before Running

**Setup the Ansible Vault Passphrase**
There are passwords, secret keys, and other sensitive information required for everything
to work. These secrets are included in the repo and they are encrypted using
ansible-vault.  To run ansible-successfully, you will need the passphrase to
decrypt them.  Ask a team member. Then, run:

```console
$ just cache-pass
```

## Running

### Common Task: Site Deployment

First, deploy our code: `ansible-playbook -l staging deploy_site_playbook.yml`
* alternative: `just deploy staging`

Next, restart containers.

```
$ ssh infinite@infinite.industries

prod $ cd docker-files
prod $ docker-compose up -d
prod $ sudo systemctl restart nginx
```

### Task: First Time Setup

**These steps only needs to happen once**

1. Add the IP address and other info the appropriate section of the `hosts`
   file.  These instructions assume a new host is being added to the staging
   environment.

2. Do the initial install: `ansible-playbook -l staging base_playbook.yml`
* alternative: `just init staging`

3. Setup certbot (per these [instructions](https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal).

```
$ sudo certbot certonly --nginx
```
* enter: *staging.infinite.industries,staging-api.infinite.industries* (or *infinite.industries,api.infinite.industries* if this is for prod)>

4. Deploy our code: `ansible-playbook -l staging deploy_site_playbook.yml`.
* alternative: `just deploy staging`

5. Start the service.

```
$ ssh infinite@infinite.industries

staging $ cd docker-files
staging $ docker-compose up -d
staging $ sudo systemctl restart nginx
```

### Task: Updating secret information

There are some files- generally yaml files with variables-  which are
encrypted. To update these files, use the `ansible-vault` command.  For
instance:

```console
$ ansible-vault edit group_vars/staging/secrets
```

### Task: Adding Domains to TLS certs

If you later want to direct additional sub-domains you can run:

```
sudo certbot certonly \
  -d infinte.com \
  -d api.infinite.industries \
  -d new-sub.infinite.industries
```

### Task: Manually updating certs

*This shouldn't normally be required because certbot will keep these up to
date, but it may be required in staging occasionally because we turn the server
off when not in use*

```console
$ sudo certbot renew
```

TODOS (Jason):
* Restart services if they have been updated
* Add SSH key management for users.
