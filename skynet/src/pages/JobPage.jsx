// import { useState } from "react";
import React, { useState } from "react";
import { useEffect } from "react";

import { invoke } from "@tauri-apps/api/tauri";
import "../App.css";
import protobuf from "protobufjs";
import {
  createRelayNode,
  createDecoder,
  createEncoder,
  waitForRemotePeer,
} from "@waku/sdk";
import { useAccount } from "wagmi";

const ContentTopic = `/skynet/1/chat/proto`;
const Encoder = createEncoder({ contentTopic: ContentTopic });
const Decoder = createDecoder(ContentTopic);

const SimpleChatMessage = new protobuf.Type("SimpleChatMessage")
  .add(new protobuf.Field("timestamp", 1, "uint32"))
  .add(new protobuf.Field("srcId", 2, "string"))
  .add(new protobuf.Field("dstId", 3, "string"))
  .add(new protobuf.Field("body", 4, "string"))
  .add(new protobuf.Field("ACK", 5, "uint32"))
  .add(new protobuf.Field("SYN", 6, "uint32"));

let clientId = import.meta.env.VITE_ID;

const WORKERS = ["0x8c42E233514011BfcFdF3e0c1258AfaDdAC5C191"];
const EPOCHS = 1;
const N_WORKERS = 2;

function JobPage() {
  const [trainedWeights, setTrainedWeights] = useState("");
  const [pendingWeights, setPendingWeights] = useState(null)

  useEffect(() => {
    if (pendingWeights == null) return;
    if (pendingWeights == 0) {
      invoke('aggregator', { number: WORKERS.length })
    }
  }, [pendingWeights])

  const reducer = (state, action) => {
    const _inPipe = { ...state.inPipe };
    const ACK = action.ACK ?? 0;
    const _messages = [...state.messages];

    switch (action.type) {
      case "ADD_MESSAGE":
        console.log("Message received!");
        _messages.push(JSON.stringify(action.message));
        const weights = JSON.parse(action.message.body).weights;
        if (weights) {
          invoke("store_weights", { weights });
          console.log("Getting trained weights ...");
          invoke("get_weights").then((weights) => {
            console.log(weights);
            setTrainedWeights({ weights, nonce: state.sendCounter });
          });
        }
        const trained_weights = JSON.parse(action.message.body).trained_weights;
        if (trained_weights) {
          console.log("Got trained weights ...");
          invoke("store_n", {
            weights: trained_weights,
            number: (WORKERS.indexOf(action.message.srcId) + 1).toString(),
          });
          // invoke("get_weights").then((weights) => {
          //   console.log(weights);
          //   setTrainedWeights(weights);
          // });
        }

        return {
          ...state,
          messages: _messages,
          serverId: action.message.srcId,
        };
      case "ACK":
        delete _inPipe[action.id];
        return { ...state, inPipe: _inPipe };
      case "SEND_MESSAGE":
        const protoMsg = SimpleChatMessage.create({
          timestamp: new Date(),
          srcId: clientId,
          dstId: action.dstId,
          body: JSON.stringify(action.body),
          ACK: ACK,
          SYN: action.SYN ?? state.sendCounter + 1,
        });
        const payload = SimpleChatMessage.encode(protoMsg).finish();

        // Send over Waku Relay
        action.waku.relay.send(Encoder, { payload });
        console.log("Message sent!");

        if (ACK == 0) {
          _inPipe[state.sendCounter + 1] = {
            dstId: action.dstId,
            body: action.body,
            SYN: state.sendCounter + 1,
          };
        } else {
          console.log("Sending ACK!");
        }

        return {
          ...state,
          inPipe: _inPipe,
          sendCounter:
            ACK == 0 && !action.SYN ? state.sendCounter + 1 : state.sendCounter,
        };
      // case "RESEND":
      //   Object.values(state.inPipe).forEach(({dstId, body, SYN}) => {
      //     console.log(`Resending ${SYN} ...`)
      //     const protoMsg = SimpleChatMessage.create({
      //       timestamp: new Date(),
      //       srcId: clientId,
      //       dstId: dstId,
      //       body: JSON.stringify(body),
      //       ACK: ACK,
      //       SYN: SYN
      //     });
      //     const payload = SimpleChatMessage.encode(protoMsg).finish();

      //     // Send over Waku Relay
      //     action.waku.relay.send(Encoder, { payload });
      //   })
      //   return {...state}
      default:
        return state;
    }
  };

  useEffect(() => {
    if (trainedWeights !== "") {
      const { weights } = trainedWeights;
      console.log("Sending trained weights ...");

      dispatch({
        type: "SEND_MESSAGE",
        dstId: state.serverId,
        body: {
          trained_weights: weights,
        },
        waku: waku,
      });
    }
  }, [trainedWeights]);

  const initState = {
    sendCounter: 0,
    messages: [],
    inPipe: {},
    serverId: null,
  };
  const [waku, setWaku] = React.useState(undefined);
  const [wakuStatus, setWakuStatus] = React.useState("None");

  const [state, dispatch] = React.useReducer(reducer, initState);
  const dstId = React.useRef(null);

  const { address, connector, isConnected } = useAccount();
  useEffect(() => {
    if (!isConnected) {
      return;
    }
    clientId = address;
  }, [isConnected]);
  // console.log(address)
  // clientId = address

  React.useEffect(() => {
    console.log("Message found!");
    if (!state.messages.length) return;
    console.log("Message found!");
    const message = JSON.parse(state.messages[state.messages.length - 1]);
    console.log(`Message-${message.SYN} found!`);
    dispatch({
      type: "SEND_MESSAGE",
      dstId: message.srcId,
      body: {},
      ACK: message.SYN,
      waku: waku,
    });
  }, [state.messages.length]);

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
    console.log(wakuMessage);
    if (!wakuMessage.payload) return;

    const message = SimpleChatMessage.decode(wakuMessage.payload);

    if (message.dstId != clientId) return;

    if (message.ACK) {
      dispatch({
        type: "ACK",
        id: message.ACK,
      });
      return;
    }

    dispatch({
      type: "ADD_MESSAGE",
      message: message,
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

    dispatch({
      type: "SEND_MESSAGE",
      dstId: dstId.current.value,
      body: {},
      waku: waku,
    });
  };

  const isConfirmed = (pktId) => {
    return !Object.keys(state.inPipe).has(pktId);
  };

  const resend = () => {
    Object.values(state.inPipe).forEach(({ dstId, body, SYN }) => {
      dispatch({
        type: "RESEND",
      });
    });
  };
  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

  // setInterval(resend, 30000);

  return (
    <div className="App">
      <header className="App-header">
        <p>{wakuStatus}</p>
        <input type="text" ref={dstId} />
        <button onClick={sendMessageOnClick} disabled={wakuStatus !== "Ready"}>
          Send Message
        </button>
        <div class="flex justify-between mb-1">
          <span class="text-base font-medium text-blue-700 dark:text-white">
            Progress
          </span>
          <span class="text-sm font-medium text-blue-700 dark:text-white">
            {state.messages.length / (N_WORKERS * EPOCHS)}
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            class="bg-blue-600 h-2.5 rounded-full"
            style={{ width: state.messages.length / (N_WORKERS * EPOCHS) }}
          ></div>
        </div>
        {/* <ul>
          {state.messages.map((msg) => {
            return (
              <li>
                <p>{msg}</p>
              </li>
            );
          })}
        </ul> */}
        {/* <p>In pipe: {Array.from(Object.keys(state.inPipe)).join(" ")}</p> */}
        <button
          onClick={async () => {
            setPendingWeights(WORKERS.length)
            for (let ep = 0; ep < EPOCHS; ep++) {
              let initialWeights = {};
              if (ep == 0) {
                initialWeights = await invoke("initialize");
                console.log(initialWeights);
              }
              WORKERS.map(async (workerId, _) => {
                dispatch({
                  type: "SEND_MESSAGE",
                  dstId: workerId,
                  body: {
                    weights: initialWeights,
                  },
                  waku: waku,
                });
              });
              await sleep(5000);
              while (state.inPipe.length) {
                await sleep(1000);
              }
            }
          }}
          disabled={wakuStatus !== "Ready"}
        >
          Start
        </button>
      </header>
    </div>
  );
}
export default JobPage;
