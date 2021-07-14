#!/bin/bash

# hello world (of bash).

for f in $(ls /home/rene/data1/htdocs/localhost_v2/t_l2_*.sh)
do
    $f
done
