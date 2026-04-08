#!/usr/bin/env bash
# Usage:
#   ./testcli.sh [--mode plain|markdown] [--date YYYY-MM-DD]
#
# Renders the lunisolar calendar via the cli-calendar.js module.
# Must be run from the project root.

set -euo pipefail

MODE="plain"
DATE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --mode) MODE="$2"; shift 2 ;;
    --date) DATE="$2"; shift 2 ;;
    *) echo "Unknown argument: $1" >&2; exit 1 ;;
  esac
done

TESTCLI_MODE="$MODE" TESTCLI_DATE="$DATE" node --input-type=module << 'NODESCRIPT'
import { renderCalendar, renderCalendarMarkdown, getVietnamNow } from './src/lib/cli-calendar.js';

const mode = process.env.TESTCLI_MODE || 'plain';
const dateStr = process.env.TESTCLI_DATE || '';

let targetDate;
if (dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  targetDate = new Date(y, m - 1, d);
} else {
  const now = getVietnamNow();
  targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

const showFooter = !!dateStr;

if (mode === 'markdown') {
  process.stdout.write(renderCalendarMarkdown(targetDate, undefined, showFooter));
} else {
  process.stdout.write(renderCalendar(targetDate, true, undefined, showFooter));
}
NODESCRIPT
