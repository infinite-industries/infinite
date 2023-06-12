This directory contains ansible variables.

These variables are specific to ansible and its invocation.  Given
the way we deploy things, many of them are ultimately manifested as environment
variables on target systems.  For instance, there are service specific j2
templates which ansible renders into `.env` like
[../docker-files/api.env.j2](../docker-files/api.env.j2)

## Guidelines

### Location

There are *a lot* of places ansible looks for variable definitions.  We store
variables in the following way:

- `group_vars/all`.  All variables used in playbooks are listed here with default or 
  placeholder values.  This serves as a quick reference as to the variables available and
  is an appropriate place to add documentation in the form of comments.

- `group_vars/staging/vars`.  All non-sensitive variables for the *staging*
  environment.

- `group_vars/staging/secrets`.  All **sensitive** variables for the *staging*
  environment.

- `group_vars/prod/vars`.  All non-sensitive variables for the *prod*
  environment.

- `group_vars/prod/secrets`.  All **sensitive** variables for the *prod*
  environment.

### Other
Other guidelines that we have for ansible variables:
- *Use snake_case for variable names*. Snake case separates each word with an underscore character (_).
All letters need to be lowercase.

## References
- [Using Variables](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_variables.html) - Core Ansible documentation
- [Variable Precedence](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_variables.html#variable-precedence-where-should-i-put-a-variable) - A reference as for where variables may be defined.

