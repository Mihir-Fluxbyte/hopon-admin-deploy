// api/proxy.js
// import fetch from 'node-fetch';
import fetch from 'isomorphic-unfetch';
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async (req: VercelRequest, res: VercelResponse) => {
  const { method, headers, body, url } = req;
  
  // const backendUrl = 'http://ec2-54-198-132-96.compute-1.amazonaws.com/api'; // Replace with your backend URL
  // const apiUrl = `${backendUrl}${url?.replace('/api/proxy', '')}`
  
  let path = url?.replace('/api/proxy/', '') ?? ''; // Call api with /api/proxy/http://ec2-54-198-132-96.compute-1.amazonaws.com/api
    // Extract the domain from the path

  // handle issue of single slash like [http:/example.com] => [http://example.com]
  path = path.replace(/(https?):(\/[^\/])/g, '$1://$2')
  const domainMatch = path.match(/^(https?:\/\/.+)$/);

  if (!domainMatch) {
    res.status(400).json({ error: 'Invalid URL format' });
    return; 
  }

  const apiUrl = domainMatch[0];
  console.log({ method, headers, body, url, apiUrl});

  // causing error so need to delete
  delete headers['transfer-encoding'];

  try {
    const response = await fetch(apiUrl, {
      method,
      headers: headers as any,
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
    });

    console.log({response})
    const responseBody = await response.text();
    res.status(response.status).send(responseBody)

    // if (!response.ok) {
    //   // Get the original error status code from the backend response
    //   const originalStatusCode = response.status;
    //   res.status(originalStatusCode).send(responseBody);
    //   return;
    // }

    // try {
    //   const jsonResponseData = JSON.parse(responseBody);
    //   res.status(response.status).json(jsonResponseData);
    // } catch (error) {
    //   console.error('JSON parse error:', error);
    //   res.status(500).json({ error: 'An error occurred while processing the response.' });
    // }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'An error occurred while proxying the request.' });
  }
};
