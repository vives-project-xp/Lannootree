import { defineStore } from "pinia"

export const useUserStore = defineStore('user', () => {

  const thisShouldBeAGetRequest = "Hostname: be200b39e6c3\r\nIP: 127.0.0.1\r\nIP: 172.22.0.3\r\nRemoteAddr: 172.22.0.4:53908\r\nGET \/ HTTP\/1.1\r\nHost: whoami.lannootree.be\r\nUser-Agent: Mozilla\/5.0 (X11; Ubuntu; Linux x86_64; rv:105.0) Gecko\/20100101 Firefox\/105.0\r\nAccept: text\/html,application\/xhtml+xml,application\/xml;q=0.9,image\/avif,image\/webp,*\/*;q=0.8\r\nAccept-Encoding: gzip, deflate, br\r\nAccept-Language: en-US,en;q=0.5\r\nCookie: authelia_session=cexz_wS_l#Lg-_NXisel%ZX0DfsshNMz\r\nDnt: 1\r\nRemote-Email: joey.desmet@student.vives.be\r\nRemote-Groups: admins,dev\r\nRemote-Name: joey\r\nRemote-User: joey\r\nSec-Fetch-Dest: document\r\nSec-Fetch-Mode: navigate\r\nSec-Fetch-Site: none\r\nSec-Fetch-User: ?1\r\nSec-Gpc: 1\r\nTe: trailers\r\nUpgrade-Insecure-Requests: 1\r\nX-Forwarded-For: 81.165.193.153\r\nX-Forwarded-Host: whoami.lannootree.be\r\nX-Forwarded-Port: 443\r\nX-Forwarded-Proto: https\r\nX-Forwarded-Server: 0abd1ceefe3d\r\nX-Real-Ip: 81.165.193.153";
  const userInfo = thisShouldBeAGetRequest.split(/\r?\n/);

  const userEmail = userInfo.filter(
    s => s.includes('Remote-Email')
  );

  const userGroups = userInfo.filter(
    s => s.includes('Remote-Groups: ')
  )[0]
  .replace('Remote-Groups: ', '')
  .split(',');

  return {
    userEmail,
    userGroups
  };
});
