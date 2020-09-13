import { 
  Client, 
  StompHeaders,
  Frame,
  Message as StompMessage
} from '@stomp/stompjs'
import * as WebSocket from 'ws';
import { getCallbackFunction } from './utils';

Object.assign(global, { WebSocket });

export interface ConnectionParams {
  host: string,
  port: number,
  username: string,
  password: string
}

export interface Message {
  body: Object,
  headers?: StompHeaders
}

export type onMessageCallbackType = (msg: Object, frame?: StompMessage) => void

export default class Whisperer {
  client: Client;
  _destinationPrefix: string = '/topic/';

  init: () => Promise<void>;

  constructor(
    connectionParams: ConnectionParams
  ) {
    this.client = new Client({
      brokerURL: `ws://${connectionParams.host}:${connectionParams.port}/ws`,
      connectHeaders: {
        login: connectionParams.username,
        passcode: connectionParams.password
      },
      // debug: console.log
    })

    // this.client.onConnect = this._onConnect;

    this.client.onStompError = this._onError
    
    this.init = () => new Promise((resolve, reject) => {
      console.log("Calling activate: ", connectionParams)
      this.client.activate();

      this.client.onConnect = (frame) => { this._onConnect(frame); resolve(); }
      this.client.onStompError = reject;
    })
    
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
    onMessage: onMessageCallbackType
  ) {
    if (!this.isInitialized) {
      throw new Error('Client not initialized');
    }
    this.client.subscribe(this._destinationPrefix + destination, getCallbackFunction(onMessage), {
        durable: 'true',  // to make sure we don't lose messages if we or broker is offline
        'auto-delete': 'false', // ensures the queue isn't deleted if no active subscribers (we can set this false)
        'prefetch-count': '1', // ensures only message from this queue goes to a subscriber at a time
        ack: 'client-individual', // don't consider messages delivered unless we explicility call .ack() for every message;
    });
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
      body: JSON.stringify(message.body),
      headers: message.headers
    });
  }
}
