import React from 'react'
import { ChatProvider } from '../../context/chatContext'
import CentroChat from './CentroChat'

function ChatPage() {
  return (
    <ChatProvider>
        <CentroChat></CentroChat>
    </ChatProvider>
  )
}

export default ChatPage