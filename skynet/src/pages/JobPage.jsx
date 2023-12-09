// import { useState } from "react";
import React from "react";

import { invoke } from "@tauri-apps/api/tauri";
import "../App.css";
import protobuf from "protobufjs";
import {
  createRelayNode,
  createDecoder,
  createEncoder,
  waitForRemotePeer,
} from "@waku/sdk";
import { useEffect, useState, useCallback } from "react";

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

const WORKERS = [4000, 5000]
const EPOCHS = 3

const reducer = (state, action) => {
  const _inPipe = {...state.inPipe}
  const ACK = action.ACK ?? 0

  switch (action.type) {
    case "ADD_MESSAGE":
      console.log("Message received!")
      const _messages = state.messages
      _messages.push(JSON.stringify(action.message))
      return { ...state, messages: _messages }
    case "ACK":
      delete _inPipe[action.id]
      return { ...state, inPipe: _inPipe }
    case "SEND_MESSAGE":
      const protoMsg = SimpleChatMessage.create({
        timestamp: new Date(),
        srcId: clientId,
        dstId: action.dstId,
        body: JSON.stringify(action.body),
        ACK: ACK,
        SYN: action.SYN ?? state.sendCounter + 1
      });
      const payload = SimpleChatMessage.encode(protoMsg).finish();
  
      // Send over Waku Relay
      action.waku.relay.send(Encoder, { payload });
      console.log("Message sent!")

      if (ACK == 0) {
        _inPipe[state.sendCounter + 1] = {
          dstId: action.dstId,
          body: action.body,
          SYN: state.sendCounter + 1
        }
      }
      else {
        console.log("Sending ACK!")
      }

      return {
        ...state,
        inPipe: _inPipe,
        sendCounter: ACK == 0 && !action.SYN ? state.sendCounter + 1 : state.sendCounter
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
      return state
  }
}

const initState = {
  sendCounter: 0,
  messages: [],
  inPipe: {}
}

function JobPage() {
  const [waku, setWaku] = React.useState(undefined);
  const [wakuStatus, setWakuStatus] = React.useState("None");

  const [state, dispatch] = React.useReducer(reducer, initState)
  // const [sendCounter, setSendCounter] = React.useState(1);
  // const [messages, setMessages] = React.useState([]);
  // const [inPipe, setInPipe] = React.useState(() => new Set());

  const dstId = React.useRef(null);

  React.useEffect(() => {
    if (!state.messages.length) return;
    const message = JSON.parse(state.messages[state.messages.length - 1]);
    console.log(`Message-${message.SYN} found!`)
    dispatch({
      type: "SEND_MESSAGE",
      dstId: message.srcId,
      body: {},
      ACK: message.SYN,
      waku: waku
    })
  }, [state.messages.length])

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

    const message = SimpleChatMessage.decode(wakuMessage.payload);

    if (message.dstId != clientId) return;

    console.log(message)
    if (message.ACK) {
      dispatch({
        type: "ACK",
        id: message.ACK
      })
      return;
    }

    dispatch({
      type: "ADD_MESSAGE",
      message: message
    })
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
    })

  };

  const isConfirmed = (pktId) => {
    return !Object.keys(state.inPipe).has(pktId)
  }

  const resend = () => {
    Object.values(state.inPipe).forEach(({dstId, body, SYN}) => {
      dispatch({
        type: "RESEND",
      })
    })

  }
  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

  // setInterval(resend, 30000);

  return (
    <div className="App">
      <header className="App-header">
        <p>{wakuStatus}</p>
        <input type="number" ref={dstId} />
        <button onClick={sendMessageOnClick} disabled={wakuStatus !== "Ready"}>
          Send Message
        </button>
        <ul>
          {state.messages.map((msg) => {
            return (
              <li>
                <p>
                  {msg}
                </p>
              </li>
            );
          })}
        </ul>
        <p>In pipe: {Array.from(Object.keys(state.inPipe)).join(' ')}</p>
        <button onClick={async () => {
          for(let _ = 0; _ < EPOCHS; _++) {
            WORKERS.map(async (workerId, _) => {
              dispatch({
                type: "SEND_MESSAGE",
                dstId: workerId,
                body: {},
                waku: waku,
              })
            })
            await sleep(5000)
            while (state.inPipe.length) { await sleep(1000) }
          }
        }} disabled={wakuStatus !== "Ready"}>
          Start
        </button>
      </header>
    </div>
  );
}
export default JobPage;
