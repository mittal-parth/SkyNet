import * as React from "react";
import protobuf from "protobufjs";
import {
  createRelayNode,
  createDecoder,
  createEncoder,
  waitForRemotePeer,
} from "@waku/sdk";

const ContentTopic = `/skynet/1/chat/proto`;
const Encoder = createEncoder({ contentTopic: ContentTopic });
const Decoder = createDecoder(ContentTopic);

const SimpleChatMessage = new protobuf.Type("SimpleChatMessage")
  .add(new protobuf.Field("timestamp", 1, "uint32"))
  .add(new protobuf.Field("srcId", 2, "uint32"))
  .add(new protobuf.Field("dstId", 3, "uint32"))
  .add(new protobuf.Field("body", 4, "string"))
  .add(new protobuf.Field("ACK", 5, "uint32"))
  .add(new protobuf.Field("SYN", 6, "uint32"))

const clientId = parseInt(import.meta.env.VITE_ID)

function App() {
  const [waku, setWaku] = React.useState(undefined);
  const [wakuStatus, setWakuStatus] = React.useState("None");
  const [sendCounter, setSendCounter] = React.useState(1);
  const [messages, setMessages] = React.useState([]);
  const [inPipe, setInPipe] = React.useState(() => new Set());

  const dstId = React.useRef(null);

  React.useEffect(() => {
    if(!messages.length) return;
    const message = JSON.parse(messages[0]);
    sendMessage(waku, message.srcId, {}, message.SYN)
  }, [messages])

  React.useEffect(() => {
    if (!!waku) return;
    if (wakuStatus !== "None") return;

    setWakuStatus("Starting");
    (async () => {
      const waku = await createRelayNode({ defaultBootstrap: true });

      setWaku(waku);
      await waku.start();
      setWakuStatus("Connecting");
      await waitForRemotePeer(waku, ["relay"]);
      setWakuStatus("Ready");
    })();
  }, [waku, wakuStatus]);

  const processIncomingMessage = React.useCallback((wakuMessage) => {
    console.log("Message received", wakuMessage);
    if (!wakuMessage.payload) return;

    const {timestamp, srcId, dstId, body, ACK, SYN} = SimpleChatMessage.decode(wakuMessage.payload);

    if (dstId != clientId) return;

    const message = JSON.stringify({
      timestamp,
      srcId,
      dstId,
      body,
      ACK,
      SYN
    });

    if (ACK) {
      setInPipe((inPipe) => {
        const _inPipe = new Set(inPipe)
        _inPipe.delete(ACK)
        return _inPipe
      })
      return;
    }

    setMessages((messages) => {
      return [message].concat(messages);
    });
  }, []);

  React.useEffect(() => {
    if (!waku) return;

    // Pass the content topic to only process messages related to your dApp
    const deleteObserver = waku.relay.subscribe(
      Decoder,
      processIncomingMessage
    );

    // Called when the component is unmounted, see ReactJS doc.
    return deleteObserver;
  }, [waku, wakuStatus, processIncomingMessage]);

  const sendMessageOnClick = () => {
    // Check Waku is started and connected first.
    if (wakuStatus !== "Ready") return;

    sendMessage(waku, dstId.current.value, {}).then(() =>
      console.log("Message sent")
    );

  };

  return (
    <div className="App">
      <header className="App-header">
        <p>{wakuStatus}</p>
        <input type="number" ref={dstId} />
        <button onClick={sendMessageOnClick} disabled={wakuStatus !== "Ready"}>
          Send Message
        </button>
        <ul>
          {messages.map((msg) => {
            return (
              <li>
                <p>
                  {msg}
                </p>
              </li>
            );
          })}
        </ul>
        <p>In pipe: {Array.from(inPipe).join(' ')}</p>
      </header>
    </div>
  );

  function sendMessage(waku, dstId, body, ACK = 0) {
    // Encode to protobuf
    const protoMsg = SimpleChatMessage.create({
      timestamp: new Date(),
      srcId: clientId,
      dstId: dstId,
      body: JSON.stringify(body),
      ACK: ACK,
      SYN: sendCounter
    });
    const payload = SimpleChatMessage.encode(protoMsg).finish();
  
    // Send over Waku Relay
    const resp = waku.relay.send(Encoder, { payload });
    if (ACK == 0) {
      setInPipe((inPipe) => inPipe.add(sendCounter))
    }

    setSendCounter(sendCounter + 1)
    return resp;
  }
}

export default App;