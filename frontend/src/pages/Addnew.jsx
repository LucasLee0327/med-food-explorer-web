import { useState, useEffect, useContext }  from 'react';
import '../index.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';
import services from "../services";

function Addnew() {

  return (
      <>
          <h1>Addnew page</h1>
      </>      
  )
}

export default Addnew;