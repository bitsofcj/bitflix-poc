import { NextRequest, NextResponse } from 'next/server';

const MOVIES_API_URL = process.env.MOVIES_API_URL;
const MOVIES_API_KEY = process.env.MOVIES_API_KEY;
const FETCH_TIMEOUT_MS = parseInt(process.env.FETCH_TIMEOUT_MS || '10000', 10);

// Validate environment variables at module load time
if (!MOVIES_API_URL || !MOVIES_API_KEY) {
  console.error('ERROR: Missing required environment variables!');
  console.error('MOVIES_API_URL:', MOVIES_API_URL ? 'Set' : 'Not set');
  console.error('MOVIES_API_KEY:', MOVIES_API_KEY ? 'Set' : 'Not set');
}

export async function POST(request: NextRequest) {
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
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    const graphqlUrl = `${MOVIES_API_URL}/graphql`;

    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MOVIES_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    clearTimeout(timeout);

    if (error instanceof Error && error.name === 'AbortError') {
      console.error('GraphQL timeout:', MOVIES_API_URL);
      return NextResponse.json(
        { error: 'Request timeout' },
        {
          status: 504,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    console.error('GraphQL proxy error:', error);
    return NextResponse.json(
      {
        error: 'GraphQL proxy request failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
