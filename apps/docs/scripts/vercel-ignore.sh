#!/usr/bin/env bash
# Vercel "Ignored Build Step" for the harbor-ui project (root directory: apps/docs).
# Exit 0 = skip the build, exit 1 = build. See docs/agents/deploy.md.
#
# A build happens only when all three hold:
#   1. the target is production (git.deploymentEnabled already limits this to `main`),
#   2. the head commit message contains "[deploy]" (milestone merges M4, M5, M7 and fixes),
#   3. something under apps/docs or packages/ changed in that commit.
set -u

if [ "${VERCEL_ENV:-}" != "production" ]; then
  echo "skip: not production (${VERCEL_ENV:-unset})"
  exit 0
fi

message="${VERCEL_GIT_COMMIT_MESSAGE:-$(git log -1 --pretty=%B)}"
case "$message" in
  *"[deploy]"*) ;;
  *)
    echo "skip: no [deploy] marker in the head commit"
    exit 0
    ;;
esac

if git diff --quiet HEAD^ HEAD -- . ../../packages; then
  echo "skip: no changes under apps/docs or packages/"
  exit 0
fi

echo "build: [deploy] marker and changes under apps/docs or packages/"
exit 1
