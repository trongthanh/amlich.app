#!/usr/bin/env bash
# Usage:
#   ./testcli.sh [--mode plain|markdown] [--date YYYY-MM-DD|lYYYY-MM-DD]
#
# Renders the lunisolar calendar via the cli-calendar.js module.
# Supports solar dates (YYYY-MM-DD) and lunar dates (lYYYY-MM-DD or LYYYY-MM-DD).
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
import { convertLunar2Solar } from './src/lib/amlich.js';

const mode = process.env.TESTCLI_MODE || 'plain';
const dateStr = process.env.TESTCLI_DATE || '';

let targetDate;
if (dateStr) {
  // Check if it's a lunar date (starts with l or L)
  const lunarMatch = /^[lL](\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (lunarMatch) {
    // Convert lunar date to solar
    const [lunarYear, lunarMonth, lunarDay] = [lunarMatch[1], lunarMatch[2], lunarMatch[3]];
    const [solarDay, solarMonth, solarYear] = convertLunar2Solar(
      parseInt(lunarDay),
      parseInt(lunarMonth),
      parseInt(lunarYear),
      0, // lunarLeap: 0 for non-leap month
      7  // timeZone: Vietnam UTC+7
    );
    targetDate = new Date(solarYear, solarMonth - 1, solarDay);
  } else {
    // Parse solar date (YYYY-MM-DD)
    const [y, m, d] = dateStr.split('-').map(Number);
    targetDate = new Date(y, m - 1, d);
  }
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
