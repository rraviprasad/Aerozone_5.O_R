const http = require('http');

const urls = [
  'http://localhost:5000/api/data/get-data',
  'http://localhost:5000/data/get-data'
];

async function checkNext() {
  if (urls.length === 0) return;
  const url = urls.shift();
  console.log(`Checking ${url}`);
  http.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log(`Status for ${url}: ${res.statusCode}`);
      try {
        const json = JSON.parse(data);
        console.log(`Received ${json.length} items from ${url}`);
      } catch (e) {
        console.log('Error parsing JSON for', url);
        // console.log('Raw data:', data.substring(0, 200));
      }
      checkNext();
    });
  }).on('error', (err) => {
    console.error('Fetch error:', err.message);
    checkNext();
  });
}

checkNext();
