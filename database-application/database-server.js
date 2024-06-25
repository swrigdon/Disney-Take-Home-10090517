const http = require('http');

const PORT = 8901;
const DATABASE_SIZE = 20000000;
const NUM_SHARDS = 13;
const ENTRIES_PER_SHARD = Math.ceil(DATABASE_SIZE / NUM_SHARDS);

// The "database" is a list of ordered lists (or "shards").
const shardList = [[]];

// Create fake media segment data and populate the database with the results.
// (The "database" is simply an ordered list in memory above.)
function createFakeMediaSegmentsData() {
    // Initialize the media timeline cursor
    let timelineCursor = Date.now();
    // Start with shard index 0
    let shardIndex = 0;
    const maxDuration = 10000;
    const minDuration = 5000;

    for (let i = 0; i < DATABASE_SIZE; i++) {
        const duration = Math.round(Math.random() * (maxDuration - minDuration) + minDuration);

        shardList[shardIndex].push({
            duration,
            start: timelineCursor,
            end: timelineCursor + duration,
            index: i,
        });

        timelineCursor += duration;

        // Divide the database into evenly distributed chunks based on total database size
        // and the max number of shards specified
        if (shardList[shardIndex].length >= ENTRIES_PER_SHARD){
            shardList.push([]);
            shardIndex ++;
        }
    }
}

function getShardIndex(start, end, position){
    if(start > end){
        return -1;
    }

    let mid = Math.floor((end - start) / 2) + start;
    if (position >= shardList[mid][0].start && position <= shardList[mid][shardList[mid].length - 1].end){
        return mid;
    } else if (position < shardList[mid][0].start){
        return getShardIndex(start, mid - 1, position);
    } else {
        return getShardIndex(mid + 1, end, position);
    }
}

const server = http.createServer((req, res) => {
    const base = `http://localhost:${server.address().port}`;
    const url = new URL(req.url, base);

    const response = { result: null };
    let status = 404;

    if (url.pathname === '/range') {
        status = 200;
        response.result = {
            start: shardList[0][0].start,
            end: shardList[shardList.length - 1][shardList[shardList.length - 1].length - 1].end,
            length: ENTRIES_PER_SHARD
        };
    } else if (url.pathname === '/query') {
        const position = parseInt(url.searchParams.get('position'));
        const queryiedIndex = parseInt(url.searchParams.get('index'), 10);
        const shardIndex = getShardIndex(0, shardList.length - 1, position);
        let result = null;

        if (queryiedIndex < shardList[shardIndex].length) {
            result = shardList[shardIndex][queryiedIndex];
        }

        if (result) {
            status = 200;
        }

        response.result = result;
    } else {
        response.result = null;
    }

    const message = JSON.stringify(response);

    // Simulate disk and network work loads with a timeout.
    setTimeout(() => {
        res.writeHead(status, {
            'content-type': 'application/json',
            'content-length': Buffer.byteLength(message),
        });

        res.end(message);
    }, 10);
});

server.on('listening', () => {
    const { port } = server.address();
    console.log('Database server listening on port', port);
});

// Seed the database and start the server.
createFakeMediaSegmentsData();
server.listen(PORT);
