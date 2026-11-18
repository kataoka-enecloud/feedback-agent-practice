#!/bin/sh
[ "$CLAUDE_CODE_REMOTE" = true ] || exit 0
pnpm install
echo "PATH=$CLAUDE_PROJECT_DIR/node_modules/.bin:$PATH" >> "$CLAUDE_ENV_FILE"
