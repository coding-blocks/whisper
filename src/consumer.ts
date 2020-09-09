import * as AMQP from 'amqplib/index';
import { Connection, Channel, ConsumeMessage } from 'amqplib';

export default class Consumer {
  exchangeName: string;
  connectionString: string;
  keys: Array<string>;

  conn: Connection;
  channel: Channel;

  constructor(
    connectionString: string,
    exchangeName: string,
    keys: Array<string>
  ) {
    this.connectionString = connectionString;
    this.exchangeName = exchangeName;
    this.keys = keys;
  }

  async initialize(
    onMessage: (msg: ConsumeMessage) => Promise<void>
  ) {
    this.conn = await AMQP.connect(this.connectionString);
    this.channel = await this.conn.createChannel();

    await this.channel.assertExchange(this.exchangeName, 'topic');

    const q = await this.channel.assertQueue('', {
      exclusive: true 
    })

    await Promise.all(this.keys.map(key => this.channel.bindQueue(q.queue, this.exchangeName, key)))

    this.channel.consume(q.queue, onMessage)
  }
}
