import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { getServiceOrigin } from './origins';

export function createSocketConnection() {
  let user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
  if (!user || !user.access_token)
    return
  const connection = new HubConnectionBuilder()
    .withUrl(`${getServiceOrigin()}/product-ws/hub/`,{ accessTokenFactory: () => user.access_token })
    .configureLogging(LogLevel.Information)
    .withAutomaticReconnect()
    .build()

  return connection
}

