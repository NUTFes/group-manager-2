#!/usr/bin/env bash

git fetch --tag 2>/dev/null
version="$(git tag --sort=-v:refname | head -1 | sed 's/^v//')"

IFS='.' read -ra tokens <<<"${version:-0.0.0}"
major="${tokens[0]}"; minor="${tokens[1]}"; patch="${tokens[2]}";
case "$1" in
    major) major="$((major + 1))"; minor=0; patch=0 ;;
    minor) minor="$((minor + 1))"; patch=0 ;;
    patch) patch="$((patch + 1))" ;;
esac

git tag "v${major}.${minor}.${patch}"
git tag --force "v${major}" >/dev/null 2>&1
git push --force --tags >/dev/null 2>&1
echo "v${major}.${minor}.${patch}"
