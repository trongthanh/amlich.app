import { renderCalendar, getVietnamNow } from '../src/lib/cli-calendar.js';

function isBrowserRequest(request) {
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

function isCurlRequest(request) {
	return (request.headers.get('User-Agent') || '').toLowerCase().startsWith('curl/');
}

export async function onRequest(context) {
	const { request, env, params } = context;

	// Browser requests → serve static assets as normal
	if (isBrowserRequest(request)) {
		return env.ASSETS.fetch(request);
	}

	// Parse optional date from URL path (expects YYYY-MM-DD)
	const pathStr = (params.path || []).join('/');
	let targetDate;

	if (pathStr) {
		const parsed = new Date(pathStr);
		targetDate = isNaN(parsed) ? null : parsed;
		if (!targetDate) {
			return new Response('Invalid date. Use format: curl amlich.app/YYYY-MM-DD\n', {
				status: 400,
				headers: { 'Content-Type': 'text/plain; charset=utf-8' },
			});
		}
	} else {
		// Default: Vietnam today
		const now = getVietnamNow();
		targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	}

	const useAnsi = isCurlRequest(request);
	const body = renderCalendar(targetDate, useAnsi);

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
}
