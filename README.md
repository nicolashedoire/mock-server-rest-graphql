# mock-server-rest-graphql

> A unified REST + GraphQL mock server, dynamically generated from a single `endpoints.json` file.

## Installation

```bash
npm install mock-server-rest-graphql
```

## Quick Start

### 1. Create an endpoints configuration file

Create a `public/config/endpoints.json` file:

```json
[
  {
    "name": "/users",
    "response": [
      { "id": 1, "name": "Alice" },
      { "id": 2, "name": "Bob" }
    ]
  },
  {
    "name": "/posts",
    "response": [
      { "id": 10, "title": "Hello World", "authorId": 1 },
      { "id": 11, "title": "GraphQL Rocks", "authorId": 2 }
    ]
  }
]
```

### 2. Start the server

In your `package.json`, add this script:

```json
{
  "scripts": {
    "mock:server": "mock-server-rest-graphql public/config/endpoints.json"
  }
}
```

Then run:

```bash
npm run mock:server
```

The server will start on port 3001 by default.

### 3. Integrate the widget in your front-end application

Create a React component to display and modify your endpoints:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { initDataMockerWidget } from "mock-server-rest-graphql";

export default function DataMockerContainer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = containerRef.current;
    if (!mount) {
      console.error("DataMockerContainer: ref not initialized");
      return;
    }

    initDataMockerWidget({
      mountPoint: mount,
      configUrl: "/config/endpoints.json",
      onChange: (endpoints) => {
        console.log("Updated endpoints:", endpoints);
        fetch("http://localhost:3001/__mock/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(endpoints),
        });
      },
    });

    return () => {
      mount.innerHTML = "";
    };
  }, []);

  return <div ref={containerRef} />;
}
```

Import this component in your page or layout:

```tsx
import DataMockerContainer from "@/components/DataMocker";

export default function HomePage() {
  return (
    <div>
      <h1>My Application</h1>
      {/* Only show the widget in development mode */}
      {process.env.NODE_ENV === 'development' && <DataMockerContainer />}
    </div>
  );
}
```

## Usage

### REST API

Access the defined endpoints directly:

```bash
# GET /users
curl http://localhost:3001/users
```

### GraphQL API

Send your queries to the GraphQL endpoint:

```bash
curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ users { id name } }"}'
```

### Updating endpoints

Endpoints can be updated without restarting the server:

```javascript
fetch("http://localhost:3001/__mock/update", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify([
    {
      name: "/new-endpoint",
      response: { message: "Added dynamically!" }
    }
  ])
});
```

## Widget Options

The widget accepts these customization options:

```typescript
initDataMockerWidget({
  mountPoint: element,           // DOM element where to mount the widget (required)
  configUrl: '/path.json',       // URL to load the configuration (optional)
  endpoints: [...],              // Initial endpoints if no configUrl (optional)
  onChange: (endpoints) => {},   // Callback when modifications occur (optional)
  classes: {                     // Custom CSS classes (optional)
    wrapper: 'container-class',
    // other classes...
  }
});
```

## License

MIT