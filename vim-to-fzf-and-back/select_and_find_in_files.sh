#!/bin/bash

select_files.sh
cat /tmp/files | find_in_files.sh > /tmp/loc
