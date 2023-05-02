db-backup
=========

Deploy / manage a db-backup implementation.

Requirements
------------

None

Role Variables
--------------

The following variables, already used by other parts of the ansible deployemnt, are required:

```
# defaults file for db-backup
pgdatabase: db_name
pghost: db_host
pgport: db_port
pguser: db_user
pgpassword: db_pass
```

Variables related to the AWS connection details are required:
```
backup_aws_region: us-west-2
backup_aws_s3_bucket: infinite-industries-backups
backup_aws_access_key_id: akia
backup_aws_secret_access_key: secret
```

Dependencies
------------

None.

Example Playbook
----------------

Including an example of how to use your role (for instance, with variables passed in as parameters) is always nice for users too:

    - hosts: servers
      roles:
         - db-backup

License
-------

MIT
