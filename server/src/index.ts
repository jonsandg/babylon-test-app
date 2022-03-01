import 'dotenv-flow/config';
import logger from 'jet-logger';
import server from './server';

// Constants
const serverStartMsg = 'Socket.io server started on port: ',
  port = process.env.PORT || 3001;

// Start server
server.listen(port, () => {
  logger.info(serverStartMsg + port);
});
