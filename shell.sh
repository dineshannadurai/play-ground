#!/usr/bin/env bash

set -e

CHANGED_FILES=($(git diff --name-only --diff-filter=ACMRTUXB origin/main))
echo "initial array ${CHANGED_FILES[*]}"
for index in "${!CHANGED_FILES[@]}" ;
  do [[ ${CHANGED_FILES[$index]} == !(*.js|*.jsx|*.ts|*.tsx) ]] && unset -v 'CHANGED_FILES[$index]' ;
  echo ${CHANGED_FILES[$index]}
done
CHANGED_FILES=("${CHANGED_FILES[@]}")
echo "updated array ${CHANGED_FILES[*]}"
# if [[ -z ${CHANGED_FILES} ]]; then
#   echo "::set-output name=files_changed::false"
#   exit 0;
# else
#   echo "::set-output name=files_changed::true"
#   echo "${CHANGED_FILES}"
#   exit 0;
# fi