// @ts-ignore
import AgonesSDK from '@google-cloud/agones-sdk';
import logger from 'jet-logger';

const agonesSDK = new AgonesSDK();
let isReady = false;

export const getAgonesClient = async () => {
  if (isReady) {
    return agonesSDK;
  }

  await agonesSDK.connect();
  logger.info('Connected to Agones SDK server');
  await agonesSDK.ready();
  isReady = true;
  return agonesSDK;
};
