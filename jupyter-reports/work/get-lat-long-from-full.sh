#!/usr/bin/env bash

echo "$1" | grep -o [/][@].*[/] | sed -r 's/[/]+//g'
