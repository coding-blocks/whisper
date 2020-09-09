import * as AMQP from 'amqplib/index';
import { Connection, Channel } from 'amqplib';

export default class Emitter {
  exchangeName: string;
  connectionString: string;

  conn: Connection;
  channel: Channel;

  constructor(
    connectionString: string,
    exchangeName: string
  ) {
    this.connectionString = connectionString;
    this.exchangeName = exchangeName;
  }

  async initialize() {
    this.conn = await AMQP.connect(this.connectionString);
    this.channel = await this.conn.createChannel();

    this.channel.assertExchange(this.exchangeName, 'topic');

    return this;
  }

  emitMessage(topics: Array<string>, messageBuffer: Object): boolean {
    return this.channel.publish(
      this.exchangeName, 
      topics.join('.'), 
      Buffer.from(messageBuffer)
    );
  }
}
