import { describe, it, expect } from 'vitest';
import { isBrowserRequest, isCurlRequest, isWgetRequest, acceptsMarkdown, isStaticFilePath } from './[[path]].js';

function makeRequest(headers = {}) {
	return new Request('https://amlich.app/', { headers });
}

describe('isCurlRequest', () => {
	it('returns true for curl user-agent', () => {
		expect(isCurlRequest(makeRequest({ 'User-Agent': 'curl/8.7.1' }))).toBe(true);
	});

	it('returns true for older curl versions', () => {
		expect(isCurlRequest(makeRequest({ 'User-Agent': 'curl/7.68.0' }))).toBe(true);
	});

	it('returns false for wget', () => {
		expect(isCurlRequest(makeRequest({ 'User-Agent': 'Wget/1.21.3' }))).toBe(false);
	});

	it('returns false for browser', () => {
		expect(isCurlRequest(makeRequest({ 'User-Agent': 'Mozilla/5.0' }))).toBe(false);
	});

	it('returns false for empty user-agent', () => {
		expect(isCurlRequest(makeRequest({}))).toBe(false);
	});
});

describe('isWgetRequest', () => {
	it('returns true for wget user-agent', () => {
		expect(isWgetRequest(makeRequest({ 'User-Agent': 'Wget/1.21.3' }))).toBe(true);
	});

	it('returns true for wget on different platforms', () => {
		expect(isWgetRequest(makeRequest({ 'User-Agent': 'Wget/1.20.3 (linux-gnu)' }))).toBe(true);
	});

	it('returns true for wget -qO- (same user-agent as regular wget)', () => {
		// wget -qO- does not change the UA; this confirms the server cannot distinguish
		expect(isWgetRequest(makeRequest({ 'User-Agent': 'Wget/1.21.3' }))).toBe(true);
	});

	it('returns false for curl', () => {
		expect(isWgetRequest(makeRequest({ 'User-Agent': 'curl/8.7.1' }))).toBe(false);
	});

	it('returns false for browser', () => {
		expect(isWgetRequest(makeRequest({ 'User-Agent': 'Mozilla/5.0' }))).toBe(false);
	});

	it('returns false for empty user-agent', () => {
		expect(isWgetRequest(makeRequest({}))).toBe(false);
	});
});

describe('isBrowserRequest', () => {
	it('returns true when Sec-Fetch-Mode is present', () => {
		expect(isBrowserRequest(makeRequest({ 'Sec-Fetch-Mode': 'navigate' }))).toBe(true);
	});

	it('returns true when Accept includes text/html', () => {
		expect(isBrowserRequest(makeRequest({ 'Accept': 'text/html,application/xhtml+xml' }))).toBe(true);
	});

	it('returns false for curl even with Accept: text/html absent', () => {
		expect(isBrowserRequest(makeRequest({ 'User-Agent': 'curl/8.7.1' }))).toBe(false);
	});

	it('returns false for wget', () => {
		expect(isBrowserRequest(makeRequest({ 'User-Agent': 'Wget/1.21.3' }))).toBe(false);
	});

	it('returns false with no headers (programmatic/AI agent)', () => {
		expect(isBrowserRequest(makeRequest({}))).toBe(false);
	});
});

describe('acceptsMarkdown', () => {
	it('returns true for Accept: text/markdown', () => {
		expect(acceptsMarkdown(makeRequest({ 'Accept': 'text/markdown' }))).toBe(true);
	});

	it('returns true for Accept: application/markdown', () => {
		expect(acceptsMarkdown(makeRequest({ 'Accept': 'application/markdown' }))).toBe(true);
	});

	it('returns false for Accept: text/plain', () => {
		expect(acceptsMarkdown(makeRequest({ 'Accept': 'text/plain' }))).toBe(false);
	});

	it('returns false for no Accept header', () => {
		expect(acceptsMarkdown(makeRequest({}))).toBe(false);
	});
});

describe('isStaticFilePath', () => {
	it('returns true for llms.txt', () => {
		expect(isStaticFilePath('llms.txt')).toBe(true);
	});

	it('returns true for assets/icon.png', () => {
		expect(isStaticFilePath('assets/icon.png')).toBe(true);
	});

	it('returns true for css/base.css', () => {
		expect(isStaticFilePath('css/base.css')).toBe(true);
	});

	it('returns false for a date path 2026-04-10', () => {
		expect(isStaticFilePath('2026-04-10')).toBe(false);
	});

	it('returns false for a lunar date path l2026-10-03', () => {
		expect(isStaticFilePath('l2026-10-03')).toBe(false);
	});

	it('returns false for empty string', () => {
		expect(isStaticFilePath('')).toBe(false);
	});
});
