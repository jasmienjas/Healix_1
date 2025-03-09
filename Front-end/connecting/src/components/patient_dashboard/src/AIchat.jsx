import React, { useState } from 'react';

const AIChat = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hi there! I'm here to help you through your health journey 😊" }
  ]);
  const [userMessage, setUserMessage] = useState('');

  const handleSendMessage = () => {
    if (userMessage.trim() === '') return;

    const newMessages = [
      ...messages,
      { sender: 'user', text: userMessage },
      { sender: 'bot', text: getAutomatedResponse() }
    ];
    setMessages(newMessages);
    setUserMessage('');
  };

  const getAutomatedResponse = () => {
    const responses = [
      "I'm so sorry you're feeling this way 😔. Please let me know if there's anything I can do to help.",
      "Stay strong! 💪 We're here for you every step of the way. Remember, you're not alone!",
      "I hope you feel better soon! 🌟 Take care of yourself and let me know if you need anything!",
      "Sending you all the positive vibes today! ✨ Stay strong and rest well 💕",
      "You've got this! 🌈 Keep taking good care of yourself, we're here to support you every moment 👐",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="chat-container">
      <h1 className="text-center text-2xl font-bold mb-4">AI Chat</h1>
      
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      
      <div className="input-container">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          className="message-input"
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage} className="send-btn">Send</button>
      </div>
    </div>
  );
};

export default AIChat;