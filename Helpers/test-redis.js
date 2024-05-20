const redis = require('redis');

// Create a Redis client
const client = redis.createClient({
  url: 'redis://127.0.0.1:6379' // Redis server URL (default is localhost:6379)
});

// Handle connection events
client.on('connect', () => {
  console.log('Connected to Redis server');
});

client.on('ready', () => {
  console.log('Redis client ready');
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

client.on('end', () => {
  console.log('Redis connection closed');
});


// Connect to Redis and perform operations
async function run() {
  await client.connect();

  try {
    // Set a key in Redis
    const setReply = await client.set('key', 'value');
    console.log('SET:', setReply);

    // Get the key from Redis
    const getReply = await client.get('key');
    console.log('GET:', getReply);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Close the connection
    await client.quit();
  }
}

run().catch(console.error);
