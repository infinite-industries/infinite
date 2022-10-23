#!/usr/bin/env bash

curl --head $1 | grep 'location:' | grep -o [/][@].*[/] | sed -r 's/[/]+//g'
