import axios from 'axios';
import { Server } from './api/types';

export const getServers = async (): Promise<Server[]> => {
  return axios(
    'http://localhost:8001/apis/agones.dev/v1/namespaces/default/gameservers'
  )
    .then(res => {
      // console.log(res.data.items[0].status);
      const servers = res.data.items.map((gameserver: any) => {
        return {
          address: gameserver.status.address,
          port: gameserver.status.ports.find(
            (port: any) => port.name === 'default'
          )?.port,
          players: gameserver.status.players,
        };
      });
      return servers;
    })
    .catch(err => {
      console.error('failed contacting kubectl proxy');
    });
};
