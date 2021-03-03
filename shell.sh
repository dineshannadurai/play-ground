#!/usr/bin/env bash

set -e

CHANGED_FILES=$(git diff --name-only --diff-filter=ACMRTUXB origin/main origin/action_test | grep  -E '(.js$|.ts$|.tsx$)')

if [[ -z ${CHANGED_FILES} ]]; then
  echo "::set-output name=files_changed::false"
  exit 0;
else
  echo "::set-output name=files_changed::true"
  echo "::set-output name=file_names::${CHANGED_FILES}"
  exit 0;
fi