import 'dotenv-flow/config';
import { getAgonesClient } from './agones';
import logger from 'jet-logger';
import server from './server';

// Constants
const serverStartMsg = 'Socket.io server started on port: ',
  port = process.env.PORT || 3001;

// Start server
server.listen(port, async () => {
  logger.info(serverStartMsg + port);

  const agonesSDK = await getAgonesClient();

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
