import * as AMQP from 'amqplib/index';
import { Connection, Channel } from 'amqplib';

export default class EventWorker {
  conn: Connection
  channel: Channel

  async initialize(
    url: string,
    exchangeName: string
  ) {
    this.conn = await AMQP.connect(url);
    this.channel = await this.conn.createChannel();

    this.channel.assertExchange(exchangeName, 'topic');
  }
}
