import * as Stomp from 'stomp-client';

export interface ConnectionParams {
  host: string,
  port: number,
  username: string,
  password: string
}

export default class Whisperer {
  client: any; // stomp-client isn't typescript safe
  _destinationPrefix: string = '/topic/';

  constructor(
    connectionParams: ConnectionParams
  ) {
    this.client = new Stomp(
      connectionParams.host,
      connectionParams.port,
      connectionParams.username,
      connectionParams.password
    );
  }

  async initialize() {
    const sessionId = await (new Promise(
      (resolve, reject) => this.client.connect(resolve, reject))
    );

    return this;
  }

  on(
    destination: string,
    onMessage: (body: string, headers?: Object) => any
  ) {
    this.client.subscribe(this._destinationPrefix + destination, onMessage);
  }

  emit(
    destination: string,
    message: string
  ) {
    this.client.publish(this._destinationPrefix + destination, message);
  }
}
