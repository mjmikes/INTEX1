#!/usr/bin/env bash
# Place in .platform/hooks/postdeploy directory
sudo certbot -n -d turtle.is404.net --nginx --agree-tos --email mjmikes@byu.edu
