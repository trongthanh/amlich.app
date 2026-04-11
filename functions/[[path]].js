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

function getAcceptQValue(accept, type) {
	for (const part of accept.split(',')) {
		const [mediaType, ...params] = part.trim().split(';');
		if (mediaType.trim().toLowerCase() === type) {
			const qParam = params.find((p) => p.trim().startsWith('q='));
			return qParam ? parseFloat(qParam.trim().slice(2)) : 1.0;
		}
	}
	return 0;
}

// Returns true if text/plain is explicitly preferred over text/markdown
export function prefersPlainText(request) {
	const accept = request.headers.get('Accept') || '';
	if (!accept.includes('text/plain')) return false;
	const plainQ = getAcceptQValue(accept, 'text/plain');
	const markdownQ = Math.max(
		getAcceptQValue(accept, 'text/markdown'),
		getAcceptQValue(accept, 'application/markdown'),
	);
	return plainQ >= markdownQ;
}

export function isStaticFilePath(pathStr) {
	return /\.[a-zA-Z0-9]+$/.test(pathStr);
}

export async function onRequest(context) {
	const { request, env, params } = context;

	// Parse path first — needed for static file check before anything else
	const pathStr = (params.path || []).join('/');

	// Static file requests (e.g. /llms.txt) → serve as-is for all clients
	if (pathStr && isStaticFilePath(pathStr)) {
		return env.ASSETS.fetch(request);
	}

	// Classify the request — determines whether we render text or fall back to the SPA
	const isAiAgent      = isAiAgentRequest(request);
	const wantsMarkdown  = acceptsMarkdown(request);
	const wantsPlainText = prefersPlainText(request);
	const isCurl = isCurlRequest(request);
	const isWget = isWgetRequest(request);

	// No text-output signal → serve the browser SPA (fallback for all other clients too)
	if (!isAiAgent && !wantsMarkdown && !wantsPlainText && !isCurl && !isWget) {
		return env.ASSETS.fetch(request);
	}

	let targetDate;

	if (pathStr) {
		// Try solar date format: YYYY-MM-DD
		const parsed = new Date(pathStr);
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
					7  // timeZone: Vietnam UTC+7
				);
				targetDate = new Date(solarYear, solarMonth - 1, solarDay);
			} else {
				return new Response(
					'Invalid date. Use format: curl -L amlich.app/YYYY-MM-DD or curl -L amlich.app/lYYYY-MM-DD\n',
					{ status: 400, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
				);
			}
		}
	} else {
		// Default: Vietnam today
		const now = getVietnamNow();
		targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	}

	const showFooter = !!pathStr;

	// Render markdown for AI agents and markdown-capable clients, unless plain text is preferred
	if ((wantsMarkdown || isAiAgent) && !wantsPlainText) {
		return new Response(renderCalendarMarkdown(targetDate, undefined, showFooter), {
			headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
		});
	}

	// Render plain text — with ANSI colors for curl/wget, without for everything else
	return new Response(renderCalendar(targetDate, isCurl || isWget, undefined, showFooter), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
}
