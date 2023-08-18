// api/proxy.js
// import fetch from 'node-fetch';
import fetch from 'isomorphic-unfetch';

export default async (req, res) => {
  const backendUrl = 'http://ec2-54-198-132-96.compute-1.amazonaws.com/api'; // Replace with your backend URL
  const { method, headers, body, url } = req;
  const apiUrl = `${backendUrl}${url.replace('/api/proxy', '')}`
  console.log({ method, headers, body, url, apiUrl  });

  delete headers['transfer-encoding'];

  try {
    const response = await fetch(apiUrl, {
      method,
      headers,
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
    });

    console.log({response})
    const responseBody = await response.text();
    if (!response.ok) {
      // Get the original error status code from the backend response
      const originalStatusCode = response.status;
      res.status(originalStatusCode).send(responseBody);
      return;
    }

    try {
      const jsonResponseData = JSON.parse(responseBody);
      res.status(response.status).json(jsonResponseData);
    } catch (error) {
      console.error('JSON parse error:', error);
      res.status(500).json({ error: 'An error occurred while processing the response.' });
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'An error occurred while proxying the request.' });
  }
};
