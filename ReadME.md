# Test local proxy

npm install -g vercel
vercel dev

changed vercel.json

change api base url to : '/api/proxy'

from

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

to

```json
{
  "rewrites": [
    {
      "source": "/api/proxy/:path(.*)",
      "destination": "/api/proxy"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}

```

