import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const ChatsPage = () => {
  const [publicMessages, setPublicMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [privateMessage, setPrivateMessage] = useState("");
  const [username, setUsername] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const stompClient = useRef(null);

  useEffect(() => {
    // Connect to WebSocket endpoint
    const socket = new SockJS("http://localhost:8080/trainingappdb/ws");
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("Connected to WebSocket");

        // Subscribe to public chatroom
        stompClient.current.subscribe("/chatroom/public", (msg) => {
          const receivedMessage = JSON.parse(msg.body);
          setPublicMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });

        // Subscribe to private chat based on username
        stompClient.current.subscribe(`/user/${username}/private`, (msg) => {
          const receivedMessage = JSON.parse(msg.body);
          setPrivateMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });
      },
    });

    stompClient.current.activate();

    return () => {
      if (stompClient.current) stompClient.current.deactivate();
    };
  }, [username]);

  const handlePublicMessageSend = () => {
    const messageDTO = {
      senderName: username,
      message: message,
      date: new Date().toLocaleString(),
      status: "MESSAGE",
    };

    stompClient.current.publish({
      destination: "/application/message",
      body: JSON.stringify(messageDTO),
    });

    setMessage("");
  };

  const handlePrivateMessageSend = () => {
    const messageDTO = {
      senderName: username,
      receiverName: receiverName,
      message: privateMessage,
      date: new Date().toLocaleString(),
      status: "MESSAGE",
    };

    stompClient.current.publish({
      destination: "/application/private-message",
      body: JSON.stringify(messageDTO),
    });

    setPrivateMessage("");
  };

  return (
    <div className="chat-container">
      <div>
        <h2>Enter your name:</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
      </div>
      <hr />
      <div className="public-chat">
        <h3>Public Chat</h3>
        <div className="messages">
          {publicMessages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.senderName}</strong>: {msg.message} <em>({msg.date})</em>
            </div>
          ))}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handlePublicMessageSend}>Send</button>
      </div>
      <hr />
      <div className="private-chat">
        <h3>Private Chat</h3>
        <input
          type="text"
          value={receiverName}
          onChange={(e) => setReceiverName(e.target.value)}
          placeholder="Receiver Username"
        />
        <div className="messages">
          {privateMessages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.senderName}</strong> to <strong>{msg.receiverName}</strong>: {msg.message}{" "}
              <em>({msg.date})</em>
            </div>
          ))}
        </div>
        <input
          type="text"
          value={privateMessage}
          onChange={(e) => setPrivateMessage(e.target.value)}
          placeholder="Type a private message..."
        />
        <button onClick={handlePrivateMessageSend}>Send Private Message</button>
      </div>
    </div>
  );
};

export default ChatsPage;
