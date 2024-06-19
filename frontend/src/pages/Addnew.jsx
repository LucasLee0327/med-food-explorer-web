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
import { AuthContext } from '../AuthContext';
import services from "../services";

const ChatGPTPage = () => {
  const authContext = useContext(AuthContext);
  const isLoggedIn = authContext? authContext.isLoggedIn : false

  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendRequest = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsTyping(true);

    try {
      const response = await services.user.poMessageToChatGPT(message);
      const content = response.chatGPTResponse;
      if (content) {
        const chatGPTResponse = {
          message: content,
          sender: "ChatGPT",
        };
        setMessages((prevMessages) => [...prevMessages, chatGPTResponse]);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <div className="App flex justify-center items-center h-screen">
          <div className="relative h-96 w-96">
            <MainContainer>
              <ChatContainer>       
                <MessageList 
                  scrollBehavior="smooth" 
                  typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
                >
                  {messages.map((message, i) => {
                    console.log(message)
                    return <Message key={i} model={message} />
                  })}
                </MessageList>
                <MessageInput placeholder="Send a Message" onSend={handleSendRequest} />        
              </ChatContainer>
            </MainContainer>
          </div>
        </div>
      ) : (
          <div className="flex items-center justify-center h-screen">
          <p className="text-3xl font-bold">請登入後使用。</p>
          </div>
      )} 
    </>
  )
}

export default ChatGPTPage;