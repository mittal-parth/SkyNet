// import { useState } from "react";
import React from 'react'

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

function JobPage() {
  const [name, setName] = useState("");
  const [waku, setWaku] = useState(undefined);
  const [wakuStatus, setWakuStatus] = useState("None");
  const [messages, setMessages] = useState([]);
  const [issender, setIsSender] = useState(0);
  const [n, setN] = useState(0);
  const [initial, setInitial] = useState(0);
  const [final, setFinal] = useState(0);
  const [s, setS] = useState(1);

  function test() {
    invoke("testpy").then((res) => {
      setS(res);
    });
  }

  useEffect(() => {
    if (!waku || waku.status != "Ready") return;
    if (issender == 1) {
      send(initial);
    } else {
      recieve(final);
    }
  }, [n]);

  async function showMessage(message) {
    let m = messages[0];
    console.log(m, "hello");
    if ((m === undefined || m == []) && issender === 1) {
      send(initial);
      return;
    }
    if ((m === undefined || m == []) && issender === 0) {
      recieve(final);
      return;
    }
    if (issender === 1) {
      if (m.n == n && m.server == 0) {
        setFinal(m.final);
        setInitial(initial + 1);
        setN(n + 1);
        console.log("server condition");
      } else {
        start(initial);
      }
    } else if (m.n == n + 1 && m.server == 1 && m.n > 0) {
      console.log("worker condition");
      setInitial(m.initial);
      test();
      setFinal(final + 1 + s);
      setN(m.n);
    } else if (m.n == n + 1 && m.server == 1 && m.n == 0) {
      setInitial(m.initial, () => recieve(final + 1));
      setFinal(final + 1);
    } else {
      recieve(final);
    }
    console.log(message);
  }

  const timeoutId = setTimeout(
    showMessage,
    10000,
    "This message will be displayed after 3 seconds."
  );

  useEffect(() => {
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

  const processIncomingMessage = useCallback((wakuMessage) => {
    if (!wakuMessage.payload) return;
    console.log("Message received", wakuMessage);
    const { initial, final, server, n } = SenderMessage.decode(
      wakuMessage.payload
    );
    let new_message = {
      initial: initial,
      final: final,
      server: server,
      n: n,
    };

    if (new_message == messages[0]) {
      return;
    }
    // console.log(new_message);
    setMessages((messages) => {
      return [new_message].concat(messages);
    });
  }, []);

  useEffect(() => {
    if (!waku) return;
    // Pass the content topic to only process messages related to your dApp
    const deleteObserver = waku.relay.subscribe(
      Decoder,
      processIncomingMessage
    );

    // Called when the component is unmounted, see ReactJS doc.
    return deleteObserver;
  }, [waku, wakuStatus, processIncomingMessage]);

  const send = (val) => {
    let message = {
      initial: val,
      final: final,
      server: 1,
      n: n,
    };
    sendMessage(message, waku).then(() => console.log("Message sent start"));
  };

  const recieve = (val) => {
    let message = {
      initial: initial,
      final: val,
      server: 0,
      n: n,
    };
    console.log(message, "rec");
    sendMessage(message, waku).then(() => console.log("Message sent rec"));
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>{wakuStatus}</p>
        {/* <button onClick={test}>Test</button> */}

        <button
          onClick={() => {
            setIsSender(1);
            setInitial(1);
            setN(1);
            // start(1);
          }}
          disabled={wakuStatus !== "Ready"}
        >
          Sender
        </button>
        <button onClick={() => recieve(1)} disabled={wakuStatus !== "Ready"}>
          Receiver
        </button>
        <p>Initial: {initial}</p>
        <p> Final: {final}</p>
        <p>Epochs: {n}</p>
        <p>Is Server: {issender}</p>
      </header>
    </div>
  );
}

const ContentTopic = `/ppp/3/chat/proto`;
const Encoder = createEncoder({ contentTopic: ContentTopic });
const Decoder = createDecoder(ContentTopic);

const SenderMessage = new protobuf.Type("SenderMessage")
  .add(new protobuf.Field("initial", 1, "uint32"))
  .add(new protobuf.Field("final", 2, "uint32"))
  .add(new protobuf.Field("server", 3, "uint32"))
  .add(new protobuf.Field("n", 4, "uint32"));

function sendMessage(message, waku) {
  const protoMsg = SenderMessage.create({
    initial: message.initial,
    final: message.final,
    server: message.server,
    n: message.n,
  });
  const payload = SenderMessage.encode(protoMsg).finish();
  return waku.relay.send(Encoder, { payload });
}
export default JobPage;
