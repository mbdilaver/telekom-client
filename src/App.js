import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const Board = () => {
  const [client, setClient] = useState();
  const [state, setState] = useState({ topic: '', messages: [] });

  useEffect(() => {
    var socket = new SockJS('http://localhost:8080/chat');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame);
    });

    setClient(stompClient);
  }, []);

  const onConnect = () => {
    client.subscribe('/notifications/' + state.topic, (msg) => {
      setState({
        ...state,
        messages: [...state.messages, msg.body],
      });
    });
  };

  const onTopicChange = (e) => {
    const topic = e.target.value;
    setState({
      ...state,
      topic: topic,
    });
  };

  return (
    <div>
      <input type='text' onChange={onTopicChange} value={state.topic} />
      <button onClick={onConnect}>Connect</button>
      <p style={{ whiteSpace: 'pre-line' }}>{state.messages}</p>
    </div>
  );
};

const App = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
      <Board />
      <Board />
      <Board />
    </div>
  );
};

export default App;
