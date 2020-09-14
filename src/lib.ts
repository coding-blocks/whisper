import { 
  Client, 
  StompHeaders,
  Frame,
  Message as StompMessage,
  debugFnType
} from '@stomp/stompjs'

import * as WebSocket from 'ws';
import { getCallbackFunction } from './utils';

Object.assign(global, { WebSocket });

export interface ConnectionParams {
  host: string,
  port: number,
  username: string,
  password: string,
  vhost?: string,
  debug?: debugFnType
}

export interface Message {
  body: any,
  headers?: StompHeaders
}

export type onMessageCallbackType = (msg: Object, frame?: StompMessage) => void

export default class Whisperer {
  _destinationPrefix: string = '/topic/';
  _defaultSubscribeHeaders: StompHeaders = {
    durable: 'true',  // to make sure we don't lose messages if we or broker is offline
    'auto-delete': 'false', // ensures the queue isn't deleted if no active subscribers (we can set this false)
    'prefetch-count': '1', // ensures only message from this queue goes to a subscriber at a time
    ack: 'client-individual', // don't consider messages delivered unless we explicility call .ack() for every message;
  }
  _defaultPublishHeaders: StompHeaders = {
    persistent: 'true'
  }

  client: Client;

  init: () => Promise<void>;

  constructor(
    connectionParams: ConnectionParams
  ) {
    this.client = new Client({
      brokerURL: `ws://${connectionParams.host}:${connectionParams.port}/ws`,
      connectHeaders: {
        login: connectionParams.username,
        passcode: connectionParams.password,
        host: connectionParams.vhost || 'whisperer'
      },
      debug: connectionParams.debug || (() => {})
    })

    this.client.onStompError = this._onError
    
    this.init = () => new Promise((resolve, reject) => {
      this.client.activate();

      this.client.onConnect = frame => { this._onConnect(frame); resolve(); }
      this.client.onStompError = frame => { this._onError(frame); reject(); }
    })
    
  }

  async _onConnect(frame: Frame) {}
  
  async _onError(frame: Frame) {}

  get isInitialized() {
    return this.client.active;
  }

  on(
    destination: string,
    onMessage: onMessageCallbackType,
    headers?: StompHeaders
  ) {
    if (!this.isInitialized) {
      throw new Error('Client not initialized');
    }
    this.client.subscribe(
      this._destinationPrefix + destination, 
      getCallbackFunction(onMessage),
      {...this._defaultSubscribeHeaders, ...headers}
    );
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
      headers: {...this._defaultPublishHeaders, ...message.headers}
    });
  }
}
