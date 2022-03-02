import React, {useEffect, useState} from 'react';
import closeButton from '../../assets/icons/close-24px.svg';
import '../ChefMessages/chefMessages.scss';
import fire from '../../config/fire';


function ChefMessages({closeModal, id, user}) {

    const db = fire.firestore();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");


    useEffect(() => {
      db.doc(`chefs/${id}`)
          .collection("messages")
          .orderBy("createdAt")
          .limit(50)
          .onSnapshot((querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));
            setMessages(data);
          });
      }, []);
      
      const handleOnChange = (event) => {
        setNewMessage(event.target.value);
      };

      const handleOnSubmit = (event) => {
        event.preventDefault();
        if (db) {
          db.doc(`chefs/${id}`).collection("messages").add({
            content: newMessage,
            createdAt: fire.firestore.FieldValue.serverTimestamp(),
            uid: user.uid
          });
        };
        setNewMessage("");
      };

    return (
        <div className="chef-messages">
          <div className="chef-messages__top">
              <h4 className="chef-messages__header">Your Recent Messages</h4>
          </div>
          <img onClick={closeModal} className="chef-messages__closeButton" src={closeButton} alt=""/>
          <div className="chef-messages__chat">
            {messages.map((message) => (
              <div key={message.id} className={message.uid === user.uid ? 'chef-messages__sent' : 'chef-messages__received'}>
                {message.content}
              </div>
            ))}
            <form onSubmit={handleOnSubmit} className="chef-messages__form">
              <input type="text" value={newMessage} onChange={handleOnChange} placeholder="" className="chef-messages__input"/>
              <button type="submit" disabled={!newMessage} className="chef-messages__button">Send</button>
            </form>
          </div>
        </div>
    );
};

export default ChefMessages
