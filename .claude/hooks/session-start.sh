#!/bin/sh
[ "$CLAUDE_CODE_REMOTE" = true ] || exit 0
pnpm install
