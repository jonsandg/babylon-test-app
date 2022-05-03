import 'dotenv-flow/config';
// @ts-ignore
import AgonesSDK from '@google-cloud/agones-sdk';
import logger from 'jet-logger';
import server from './server';

// Constants
const serverStartMsg = 'Socket.io server started on port: ',
  port = process.env.PORT || 3001;

const agonesSDK = new AgonesSDK();

// Start server
server.listen(port, async () => {
  logger.info(serverStartMsg + port);

  await agonesSDK.connect();
  logger.info('Connected to Agones SDK server');

  await agonesSDK.ready();

  function sendHealthPing() {
    setTimeout(() => {
      agonesSDK.health();
      sendHealthPing();
    }, 4000);
  }

  sendHealthPing();
});

process.on('SIGINT', function () {
  process.exit();
});
