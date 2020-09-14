# Whisperer
An event sourcing over AMQP library using STOMP.

## Getting Started

- Whisperer uses AMQP backends with STOMP plugin such as RabbitMQ
- Enable STOMP plugin in RabbitMQ using
`rabbitmq-plugins enable rabbitmq_stomp`
- Enable STOMP web plugin in RabbitMQ to enable websocket interation 
`rabbitmq-plugins enable rabbitmq_web_stomp`

## Installation

- If using npm
`npm install @coding-blocks/whisperer`
- If using yarn
`yarn add @coding-blocks/whisperer`

## Usage

- Create a whisperer object
```
import Whisperer from "@coding-blocks/whisperer";

const whisperer = new Whisperer({
  host: '127.0.0.1',
  port: 15674,
  username: 'guest',
  password: 'guest'
});

await whisperer.init()
```

- To Subscribe to topics
```
  whisperer.on('oneauth_user.created', (msg, frame) => {
    console.log("listener 2: <created>", msg)
    frame.ack()
  })
```

- To emit messages
```
  whisperer.emit('oneauth_user.created', {
    body: {
      data: 'some create message'
    }
  })
```