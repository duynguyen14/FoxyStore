import Stomp from "stompjs"
import React, { useEffect } from 'react'
import SockJS from 'sockjs-client'

function MessagesAdmin() {

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws')
    const client = Stomp.over(socket);
    client.connect({},()=>{
      // client.subscribe("/topic/message")
    })
  }, []);

  return (
    <div>
      <h1>
        hello
      </h1>
    </div>
  )
}

export default MessagesAdmin;
