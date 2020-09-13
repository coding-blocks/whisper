import Whisperer, { ConnectionParams } from "../src/index";

(async () => {
  const listener1 = new Whisperer(<ConnectionParams>{
    host: '172.17.0.2',
    port: 15674,
    username: 'rabbitmq',
    password: 'rabbitmq'
  });
  const listener2 = new Whisperer(<ConnectionParams>{
    host: '172.17.0.2',
    port: 15674,
    username: 'rabbitmq',
    password: 'rabbitmq'
  });
  const emitter1 = new Whisperer(<ConnectionParams>{
    host: '172.17.0.2',
    port: 15674,
    username: 'rabbitmq',
    password: 'rabbitmq'
  });
 
 
    await listener1.init();
    await listener2.init();
    await emitter1.init();



    listener1.on('oneauth_user.created', (msg) => {
      console.log("listener 1: <created>", msg)
    })
    listener1.on('oneauth_user.updated', (msg) => {
      console.log("listener 1: <updated>", msg)
    })
    listener2.on('oneauth_user.created', (msg) => {
      console.log("listener 2: <created>", msg)
    })


    emitter1.emit('oneauth_user.created', {
      body: {
        data: 'some create message'
      },
      headers: {
        persistent: 'true'
      }
    })
    emitter1.emit('oneauth_user.updated', {
      body: {
        data: 'some create message'
      }
    })

})()
