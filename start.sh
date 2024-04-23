#!/bin/sh
docker run --env-file .env --name ucp-search -p 8082:8082 ucp-search