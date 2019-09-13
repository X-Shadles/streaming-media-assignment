const fs = require('fs');
const path = require('path');

// folerLink is like '../client/party.mp4' while video type is like 'video/mp4'
const getVideo = (request, response, folderLink, videoType) => {
  const file = path.resolve(__dirname, folderLink);

  fs.stat(file, (err, stats) => {
    // error code
    if (err) {
      if (err.code === 'ENOENT') {
        response.writeHead(404);
      }
      return response.end(err);
    }

    // range info
    let {
      range,
    } = request.headers;

    if (!range) {
      range = 'bytes=0-';
    }

    // positions
    const positions = range.replace(/bytes=/, '').split('-');

    let start = parseInt(positions[0], 10);

    const total = stats.size;
    const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

    if (start > end) {
      start = end - 1;
    }

    const chunksize = (end - start) + 1;

    response.writeHead(206, {
      'Content-Range': `bytes  ${start}-${end}/${total}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': videoType,
    });

    const stream = fs.createReadStream(file, {
      start,
      end,
    });

    stream.on('open', () => {
      stream.pipe(response);
    });

    stream.on('error', (streamErr) => {
      stream.end(streamErr);
    });

    return stream;
  });
};

module.exports.getVideo = getVideo;
