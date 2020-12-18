#!/usr/bin/env bash

PROJECT="$(basename $(pwd))"

CURTAG=`git describe --abbrev=0 --tags`;

IFS='.' read -a vers <<< "$CURTAG"

MAJ=${vers[0]}
MIN=${vers[1]}
BUG=${vers[2]}
echo "Current Tag: v$MAJ.$MIN.$BUG"

((BUG+=1))

TAG=${MAJ}.${MIN}.${BUG}
NEWTAG="v$MAJ.$MIN.$BUG"

echo "Adding Tag: $NEWTAG";
git tag -a ${TAG} -m ${NEWTAG}
git push --tags

ssh git.immo release ${PROJECT} ${TAG} stage