import { renderCalendar, renderCalendarMarkdown, getVietnamNow } from '../src/lib/cli-calendar.js';
import { convertLunar2Solar } from '../src/lib/amlich.js';

export function isBrowserRequest(request) {
	const ua = (request.headers.get('User-Agent') || '').toLowerCase();
	const secFetchMode = request.headers.get('Sec-Fetch-Mode');
	const accept = request.headers.get('Accept') || '';
	// Sec-Fetch-Mode is only set by browsers
	if (secFetchMode) return true;
	// curl explicitly
	if (ua.startsWith('curl/')) return false;
	// Anything that accepts HTML is a browser
	if (accept.includes('text/html')) return true;
	// Default: treat as programmatic / AI agent
	return false;
}

export function isCurlRequest(request) {
	return (request.headers.get('User-Agent') || '').toLowerCase().startsWith('curl/');
}

export function isWgetRequest(request) {
	const ua = (request.headers.get('User-Agent') || '').toLowerCase();
	return ua.startsWith('wget/');
}

// AI agent UA patterns: Claude Code, OpenAI tools, Google AI, LangChain, etc.
const AI_AGENT_UA_PATTERNS = [
	'claude-code',
	'claude/',
	'claude-user',
	'anthropic',
	'chatgpt-user',
	'openai',
	'gemini',
	'deepseek',
	'qwen',
	'grok',
	'gpt',
	'langchain',
	'openrouter',
	'axios',
];

export function isAiAgentRequest(request) {
	const ua = (request.headers.get('User-Agent') || '').toLowerCase();
	// Empty or missing UA → treat as programmatic/AI agent
	if (!ua) return true;
	return AI_AGENT_UA_PATTERNS.some((pattern) => ua.includes(pattern));
}

export function acceptsMarkdown(request) {
	const accept = request.headers.get('Accept') || '';
	return accept.includes('text/markdown') || accept.includes('application/markdown');
}

export function isStaticFilePath(pathStr) {
	return /\.[a-zA-Z0-9]+$/.test(pathStr);
}

export async function onRequest(context) {
	const { request, env, params } = context;

	// Browser requests → serve static assets as normal
	// AI agents are checked first so their UA doesn't accidentally match browser heuristics
	if (!isAiAgentRequest(request) && isBrowserRequest(request)) {
		return env.ASSETS.fetch(request);
	}

	// Parse optional date from URL path (expects YYYY-MM-DD or lYYYY-MM-DD / LYYYY-MM-DD)
	const pathStr = (params.path || []).join('/');

	// Static file requests (e.g. /llms.txt) → serve as-is for all clients
	if (pathStr && isStaticFilePath(pathStr)) {
		return env.ASSETS.fetch(request);
	}

	let targetDate;

	if (pathStr) {
		// Try solar date format: YYYY-MM-DD
		let parsed = new Date(pathStr);
		if (!isNaN(parsed)) {
			targetDate = parsed;
		} else {
			// Try lunar date format: lYYYY-MM-DD or LYYYY-MM-DD
			const lunarMatch = /^[lL](\d{4})-(\d{2})-(\d{2})$/.exec(pathStr);
			if (lunarMatch) {
				const [, lunarYear, lunarMonth, lunarDay] = lunarMatch;
				const [solarDay, solarMonth, solarYear] = convertLunar2Solar(
					parseInt(lunarDay),
					parseInt(lunarMonth),
					parseInt(lunarYear),
					0, // lunarLeap: 0 for non-leap month
					7 // timeZone: Vietnam UTC+7
				);
				targetDate = new Date(solarYear, solarMonth - 1, solarDay);
			} else {
				return new Response(
					'Invalid date. Use format: curl -L amlich.app/YYYY-MM-DD or curl -L amlich.app/lYYYY-MM-DD\n',
					{
						status: 400,
						headers: { 'Content-Type': 'text/plain; charset=utf-8' },
					}
				);
			}
		}
	} else {
		// Default: Vietnam today
		const now = getVietnamNow();
		targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	}

	let body;
	let contentType;

	const showFooter = !!pathStr;

	if (acceptsMarkdown(request) || isAiAgentRequest(request)) {
		body = renderCalendarMarkdown(targetDate, undefined, showFooter);
		contentType = 'text/markdown; charset=utf-8';
	} else {
		const useAnsi = isCurlRequest(request) || isWgetRequest(request);
		body = renderCalendar(targetDate, useAnsi, undefined, showFooter);
		contentType = 'text/plain; charset=utf-8';
	}

	return new Response(body, {
		headers: { 'Content-Type': contentType },
	});
}
