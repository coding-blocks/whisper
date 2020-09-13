import Whisperer, { ConnectionParams } from "../src/index";

(async () => {
  const listener1 = new Whisperer(<ConnectionParams>{
    host: '127.0.0.1',
    port: 15674,
    username: 'guest',
    password: 'guest'
  });
  const listener2 = new Whisperer(<ConnectionParams>{
    host: '127.0.0.1',
    port: 15674,
    username: 'guest',
    password: 'guest'
  });
  const emitter1 = new Whisperer(<ConnectionParams>{
    host: '127.0.0.1',
    port: 15674,
    username: 'guest',
    password: 'guest'
  });
 
 
  await listener1.init();
  await listener2.init();
  await emitter1.init();

  listener1.on('oneauth_user.created', (msg, frame) => {
    console.log("listener 1: <created>", msg)
    frame.ack();
  })
  listener1.on('oneauth_user.updated', (msg, frame) => {
    console.log("listener 1: <updated>", msg)
    frame.ack();
  })
  listener2.on('oneauth_user.created', (msg, frame) => {
    console.log("listener 2: <created>", msg)
    frame.ack();
  })


  emitter1.emit('oneauth_user.created', {
    body: {
      data: 'some create message'
    }
  })
  emitter1.emit('oneauth_user.updated', {
    body: {
      data: 'some create message'
    }
  })

})()
