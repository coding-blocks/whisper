import { messageCallbackType, IMessage } from '@stomp/stompjs';

export function getCallbackFunction(fn: (msg: Object, frame: IMessage) => void): messageCallbackType {
  return (frame: IMessage) => fn(JSON.parse(frame.body), frame)
}
