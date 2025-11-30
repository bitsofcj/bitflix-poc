import { NextRequest, NextResponse } from 'next/server';

const MOVIES_API_URL = process.env.MOVIES_API_URL;
const MOVIES_API_KEY = process.env.MOVIES_API_KEY;
const FETCH_TIMEOUT_MS = parseInt(process.env.FETCH_TIMEOUT_MS || '10000', 10);

export async function GET(request: NextRequest) {
  // Validate environment variables
  if (!MOVIES_API_URL || !MOVIES_API_KEY) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const path = request.nextUrl.pathname;
    const searchParams = request.nextUrl.searchParams.toString();
    const fullPath = searchParams ? `${path}?${searchParams}` : path;
    const url = new URL(fullPath, MOVIES_API_URL).toString();

    console.log('Proxying healthcheck request to:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${MOVIES_API_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    clearTimeout(timeout);

    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Healthcheck timeout');
      return NextResponse.json({ error: 'Request timeout' }, { status: 504 });
    }

    console.error('Healthcheck proxy error:', error);
    return NextResponse.json(
      { error: 'Proxy request failed' },
      { status: 500 }
    );
  }
}
