#!/bin/bash
port=$1
netstat -lnp | grep ":${port} " | wc -l
return $?

 
 
