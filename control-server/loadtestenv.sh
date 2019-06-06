#!/bin/sh
# set environmental variables from .env-test file
source ./.env-test
export $(cut -d= -f1 ./.env-test)