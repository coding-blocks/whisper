import { 
  Client, 
  messageCallbackType,
  Frame,
  Message
} from '@stomp/stompjs'
import * as WebSocket from 'ws';

Object.assign(global, { WebSocket });

export interface ConnectionParams {
  host: string,
  port: number,
  username: string,
  password: string
}

export default class Whisperer {
  client: Client;
  _destinationPrefix: string = '/topic/';

  constructor(
    connectionParams: ConnectionParams
  ) {
    this.client = new Client({
      brokerURL: `ws://${connectionParams.host}:${connectionParams.port}/ws`,
      connectHeaders: {
        login: connectionParams.username,
        passcode: connectionParams.password
      }
    })

    this.client.onConnect = this._onConnect;

    this.client.onStompError = this._onError

    this.client.activate();
  }

  async _onConnect(frame: Frame) {
    // @Overridable
  }
  
  async _onError(frame: Frame) {
    // @Overridable
  }

  get isInitialized() {
    return this.client.active;
  }

  on(
    destination: string,
    onMessage: messageCallbackType
  ) {
    if (!this.isInitialized) {
      throw new Error('Client not initialized');
    }
    this.client.subscribe(this._destinationPrefix + destination, onMessage);
  }

  emit(
    destination: string,
    message: Message
  ) {
    if (!this.isInitialized) {
      throw new Error('Client not initialized');
    }
    this.client.publish({
      destination: this._destinationPrefix + destination, 
      body: message.body,
      headers: message.headers
    });
  }
}
