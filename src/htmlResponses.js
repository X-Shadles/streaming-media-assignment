const fs = require('fs');


const getIndex = (request, response, clientFile) => {
  const index = fs.readFileSync(`${__dirname}/${clientFile}`);

  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

module.exports.getIndex = getIndex;
