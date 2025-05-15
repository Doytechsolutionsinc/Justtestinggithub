import React from 'react';

export default function Chat({ text, side }) {
  return (
    <div className={`chat-bubble ${side}`}>
      <p>{text}</p>
    </div>
  );
}