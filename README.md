# BITFLIX | Movie Search

<img src="./public/BITFLIXLogo.png" alt="BITFLIX" height="60">

# <a href="https://bitflix.bitsofcj.com" target="_blank">https://bitflix.bitsofcj.com</a>


A React-based movie browsing application with GraphQL integration, featuring search, filtering, and pagination capabilities.

<img src="./public/BITFLIXscreenshot.png" alt="BitFlix Screenshot" width="800">

---

## Highlights & Improvements

### Highlights

- **Filter & Realtime Search** - The filter and search functionality work together to allow for searching all movies or filtering by genre, updating movie counts in real-time.
- **User Experience** - The BITFLIX experience is designed to be intuitive and user-friendly, with a focus on providing a seamless and enjoyable movie browsing experience similar to popular streaming platforms.
- **API Proxy** - The API proxy protects the external API authentication & features rate limiting and request timeouts to ensure optimal performance and reliability.

### Improvements
- **Caching** - More granular and robust caching strategies in the API proxy and frontend.
- **Security** - Add helmet.js for security headers | Document other security considerations.
- **Documentation** - Comprehensive external documentation for business and developer users with detailed diagrams and examples.
- **Analytics** - Implement Google Analytics, Microsoft Clarity or any other analytics tool(s) for tracking user behavior and improving the BITFLIX experience.
- **Observability** - Structured logging (winston or pino) | Performance monitoring (Datadog, New Relic, etc...) | Update health check endpoint to check dependencies and provide information about the application's status.
- **SEO** - Implement additional SEO best practices for improved search engine rankings.
- **Accessibility** - ARIA labels on interactive elements & screen reader testing.
- **CI/CD** - Implement continuous integration and deployment pipelines for automated testing and deployment.
- **Tech Stack** - Evaluate the app based on business requirements to determine if this is better suited as a Next.js application.

---

## Features

- **Movie Search** - Real-time search across movie titles
- **Genre Filtering** - Filter movies by genre with exact counts
- **Pagination** - Navigate through large movie collections
- **YouTube Integration** - Click any movie to search for its trailer
- **GraphQL API** - Efficient data fetching with Apollo Client
- **Responsive Design** - Mobile-first UI with Tailwind CSS
- **Caching** - Configurable client-side caching for improved performance
- **Rate Limiting** - Configurable API rate limiting for protection
- **TypeScript** - Full type safety on the frontend

---

## Tech Stack

### Frontend

- **React 18** with TypeScript
- **Apollo Client** for GraphQL
- **React Router v6** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **RxJS** for reactive patterns

### Backend

- **Express.js** proxy server
- **Node-Fetch** for upstream API calls
- **Rate Limiting** with configurable thresholds
- **Request Timeouts** for stability
- **CORS** support

### Testing

- **Jest** for unit and integration tests
- **React Testing Library** for component tests
- **Supertest** for API endpoint tests
- **MockedProvider** for GraphQL mocking

### Development Tools

- **CRACO** for custom webpack config
- **ESLint** for linting
- **Prettier** for code formatting
- **Storybook 8.6** for component development and documentation

---

## Getting Started

### Prerequisites

- Node.js >= 16.0 <18.0.0
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd bitflix-poc
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file from the example:

```bash
cp .env.example .env
```

Then update the `.env` file with your actual API credentials:
- Replace `<your-api-url>` with your movies API URL
- Replace `<your-api-key>` with your API key

---

## Environment Variables

### Frontend Variables (Build-time)

- `REACT_APP_GRAPHQL_URL` - GraphQL endpoint URL
- `REACT_APP_CACHE_TTL_SECONDS` - Apollo cache TTL in seconds (default: 60)
- `REACT_APP_ITEMS_PER_PAGE` - Number of items to display per page (default: 12)

### Backend Variables (Runtime)

- `PORT` - Server port (default: 3000)
- `MOVIES_API_URL` - Upstream API URL
- `MOVIES_API_KEY` - API authentication key
- `RATE_LIMIT_WINDOW_MS` - Rate limit window (default: 60000)
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window (default: 100)
- `MAX_REQUEST_SIZE` - Max payload size (default: 1mb)
- `FETCH_TIMEOUT_MS` - Upstream timeout (default: 10000)

### Running the Application

#### Development Mode

```bash
npm start
```

Starts the server with proxy on http://localhost:3000

#### Storybook

Run the component library in development mode:

```bash
npm run storybook
```

Opens Storybook on http://localhost:6006

Build static Storybook for deployment:

```bash
npm run build-storybook
```

**Available Components:**
- Button (14+ variants)
- MovieCard (5 variants)
- Pagination (6 scenarios)

Storybook v8.6.14 includes automatic documentation generation via autodocs.

---

## Testing

### Run All Tests

```bash
npm test
```

Runs all tests once (CI mode)

### Run Tests in Watch Mode

```bash
npm run test:watch
```

Runs tests in watch mode for development

### Run Tests with Coverage

```bash
npm run test:coverage
```

This generates a coverage report in the `coverage/` directory and prints a summary to the console.

### Run Server Tests

```bash
npm run test:server
```

### Test Coverage Thresholds

The project maintains **70%** coverage across:

- Branches
- Functions
- Lines
- Statements

### What's Tested

#### Unit Tests (`helpers.test.ts`)

- ✅ `getYear()` - Date parsing and edge cases
- ✅ `formatDuration()` - ISO 8601 duration formatting
- ✅ `getPageNumbers()` - Pagination logic

#### Component Tests

- ✅ **MovieCard** - Rendering, null handling, YouTube links
- ✅ **Pagination** - Navigation, disabled states, page numbers
- ✅ **GenreFilter** - Loading, selection, filtering

#### Integration Tests (`MovieBrowser.test.tsx`)

- ✅ Search functionality
- ✅ Genre filtering
- ✅ Pagination
- ✅ Loading states
- ✅ Error handling
- ✅ Empty states

#### Server Tests (`server.test.js`)

- ✅ `/healthcheck` endpoint
- ✅ `/graphql` POST endpoint
- ✅ CORS preflight requests
- ✅ Request size limits
- ✅ Timeout handling
- ✅ Error responses

---

## Code Quality

### Linting

```bash
npm run lint
```

### Formatting

```bash
# Check formatting
npm run format:check

# Fix formatting
npm run format:write
```

---

## Architecture

### Frontend Architecture

```
src/
├── components/          # React components
│   ├── MovieCard/      # Movie display card
│   ├── MovieBrowser/   # Main app container
│   ├── Pagination/     # Page navigation
│   ├── GenreFilter/    # Genre selection
│   └── ui/             # Shared UI components
├── lib/
│   ├── apollo-client.ts    # Apollo Client setup
│   ├── graphql-queries.ts  # GraphQL queries
│   ├── graphql-types.ts    # TypeScript types
│   └── helpers.ts          # Utility functions
└── App.tsx             # Root component
```

### Backend Architecture

- Express proxy server
- GraphQL endpoint at `/graphql`
- Health check at `/healthcheck`
- Static file serving from `/build`
- Rate limiting on API endpoints only

---

## Performance

- **Apollo Client Caching** - 60-second default TTL (Configurable via environment variable)
- **Request Deduplication** - Apollo prevents duplicate requests
- **Image Optimization** - Lazy loading with error handling
- **Rate Limiting** - Protects against abuse

---

## Security

- Request size limits (default: 1mb)
- Request timeouts (default: 10s)
- Rate limiting per IP
- CORS configuration
- No sensitive data in logs

---

## License

This project is licensed under the MIT License.
