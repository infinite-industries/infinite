# Infinite Ansible Scripts

This is a trimmed down version of the rats ansible meant for quick experimentation

Table of Contents
=================

 * [Requirements](#requirements)
 * [Before Running](#before-running)
 * [Running](#running)
    * [Using just](#using-just)
    * [Common Task: Site Status](#common-task-site-status)
    * [Common Task: Restart Services](#common-task-restart-services)
    * [Common Task: Site Deployment](#common-task-site-deployment)
    * [Task: First Time Setup](#task-first-time-setup)
    * [Task: Updating secret information](#task-updating-secret-information)
    * [Task: Adding Domains to TLS certs](#task-adding-domains-to-tls-certs)
    * [Task: Manually updating certs](#task-manually-updating-certs)


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
$ echo -n "passphrase" >> .password
```

*Alternatively:*

```console
$ just cache-pass
```

## Running

### Using `just`

The task runner [casey/just](https://github.com/casey/just) is used to simplify
common tasks.  Most of the "recipes" require the environment to be specified:
our environments are *local*, *staging*, and *production*.  By default, the
staging environment is used.  For instance, running `deploy status` is the
equivalent of running `deploy status staging`.


```console
$ just help
Available recipes:
    cache-pass                  # cache the passphrase used to decrypt files
    deploy env="staging"        # deploy the site. Usage: `just deploy` or `just deploy prod`
    help                        # you're looking at it!
    init env="staging"          # initial software install & config for a host.
    restart env="staging"       # restart services for an environment
    status env="staging"        # query the status of services for an environment
    update-images env="staging" # pull the (correct) updated docker image(s)
```

### Common Task: Site Status

**Check the status of the services in the staging environment.**
```console
$ just status staging
```

### Common Task: Restart Services

**Restart services in the production environment environment.**
```console
$ just restart prod
```

### Common Task: Site Deployment

```console
$ just deploy staging
```

### Common Task: Make a DB Backup

Backups are stored on the remote host in ~/backups. A small number of backups
are retained on the host: backups are also copied to an S3 bucket
(infinite-industries-backups

**Backup the database in the production environment.**
```console
$ just backup prod
```

**Copy the latest backup from production.**
```console
$ scp prod-host:backups/infinite-prod.latest .
```

### Task: Rotate ansible-vault Passphrase

```console
$ echo -n "new passphrase" > .new_password
$ ansible-vault rekey --new-vault-password-file .new_password \ 
  group_vars/staging/secrets group_vars/prod/secrets \
  docker-files/keys/staging-1nfinite.pem  docker-files/keys/prod-1nfinite.pem 
```

To validate the new passphrase:

```console
$ cd group_vars/staging
$ ansible-vault view secrets
```

### Task: First Time Setup

**These steps only needs to happen once**

1. Add the IP address and other info the appropriate section of the `hosts`
   file.  These instructions assume a new host is being added to the *staging*
   environment.

2. Do the initial install: `ansible-playbook -l staging base_playbook.yml`
* alternative: `just init staging`

3. Setup certbot (per these [instructions](https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal).

```
$ sudo certbot certonly --nginx
```

enter: `staging.infinite.industries,staging-api.infinite.industries` (or `infinite.industries,api.infinite.industries` if this is for prod)

4. Deploy our code: 
```console
$ just deploy staging
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
* Add SSH key management for users.
