const http = require('http');

http.get('http://localhost:5000/api/data/get-data', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log(`Received ${json.length} items from /get-data`);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      console.log('Raw data:', data.substring(0, 200));
    }
  });
}).on('error', (err) => {
  console.error('Fetch error:', err.message);
});
