import { Emitter, Consumer } from "../src/index";

(async () => {
  const connectionString = 'amqp://guest:guest@localhost:5672';
  const exchange = 'sample_exchange';

  const emitter = await (new Emitter(connectionString, exchange)).initialize();
  const consumer1 = await (new Consumer(connectionString, exchange, ['amoeba', 'webhook']))
    .initialize((msg) => {
      console.log("consumer 1", msg);
    });
  const consumer2 = await (new Consumer(connectionString, exchange, ['hack', 'webhook']))
    .initialize((msg) => {
      console.log("consumer 2", msg);
    });

  emitter.emitMessage('webhook', { hello: 'world' })
})()
