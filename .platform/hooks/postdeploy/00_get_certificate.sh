#!/usr/bin/env bash
# Place in .platform/hooks/postdeploy directory
sudo certbot -n -d turtle.is404.net --nginx --agree-tos --email mjmikes@byu.edu
sudo certbot -n -d http://intex-env.eba-bvpbbmfm.us-east-1.elasticbeanstalk.com/ --nginx --agree-tos --email mjmikes@byu.edu