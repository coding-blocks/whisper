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

  setTimeout(() => {
    listener1.on('oneauth_user.created', (msg) => {
      console.log("listener 1: <created>", msg)
    })
    listener1.on('oneauth_user.updated', (msg) => {
      console.log("listener 1: <updated>", msg)
    })
    listener1.on('oneauth_user.created', (msg) => {
      console.log("listener 2: <created>", msg)
    })

    setTimeout(() => {
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
    }, 2000)
  }, 2000)

})()
