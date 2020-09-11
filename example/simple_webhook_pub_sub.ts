import Whisperer, { ConnectionParams } from "../src/index";

(async () => {
  const listener1 = new Whisperer(<ConnectionParams>{
    host: '127.0.0.1',
    port: 61613,
    username: 'guest',
    password: 'guest'
  });
  const listener2 = new Whisperer(<ConnectionParams>{
    host: '127.0.0.1',
    port: 61613,
    username: 'guest',
    password: 'guest'
  });

  const emitter1 = new Whisperer({
    host: '127.0.0.1',
    port: 61613,
    username: 'guest',
    password: 'guest'
  });

  await listener1.initialize();
  await listener2.initialize();
  await emitter1.initialize();

  listener1.on('amoeba_user_create', (body: string) => {
    console.log("received<create> on 1: ", body);
  })
  listener1.on('amoeba_user_update', (body: string) => {
    console.log("received<update> on 1: ", body);
  })
  listener2.on('amoeba_user_create', (body: string) => {
    console.log("received<create> on 2: ", body);
  })
  

  setTimeout(() => {
    emitter1.emit('amoeba_user_create', 'some user 1');
    emitter1.emit('amoeba_user_create', 'some user 2');
    emitter1.emit('amoeba_user_update', 'some user 1');
  }, 3000)

})()
