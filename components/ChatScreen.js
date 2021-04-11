import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { Avatar, IconButton } from "@material-ui/core";
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useCollection} from "react-firebase-hooks/firestore";
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import { useRef, useState } from "react";
import Message from "./Message";
import firebase from "firebase";
import getReceipientEmail from "./Utils/getReceipientEmail";
import TimeAgo from "timeago-react";



function ChatScreen({chat, messages}) {

    const [user]=useAuthState(auth)
    const [input, setInput] = useState('')
    const endofMessagesRef = useRef(null)
    const router = useRouter();
    const [messagesSnapshot] = useCollection(
        db
        .collection("chats")
        .doc(router.query.id)
        .collection('messages')
        .orderBy('timestamp','asc')
        );

        const [receipientEmail] = useCollection(
            db
            .collection('users')
            .where('email', '==', getReceipientEmail(chat.users, user))
        );

         const [recipientSnapshot] = useCollection(
             db.collection("users")
             .where("email", "==", getReceipientEmail(chat.users, user))
             );

    const showMessages = ()=>{
        if(messagesSnapshot){
        return messagesSnapshot.docs.map((message)=>(
            <Message
            key={message.id}
            user={message.data().user}
            message={{
                ...message.data(),
                timestamp: message.data().timestamp?.toDate().getTime(),
            }}
            />
        ));

        }else{
            return JSON.parse(messages).map(message=>(
                <Message key={message.id} user={message.user} message={message}/>
            ))
         }

    };

    const ScrollToBottom = () =>{
        endofMessagesRef.current.scrollIntoView({
            behavior:'smooth',
            block:'start',
        })
    }

    const sendMessage = (e)=>{
        e.preventDefault();
        // update lastseen 
        db.collection('users').doc(user.uid).set(
            {
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        },
        {merge:true}
        );

        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message:input,
            user: user.email,
            photoURL: user.photoURL,
        });

        setInput('');
        ScrollToBottom();

    };
     const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail=getReceipientEmail(chat.users, user)


    return (
        <Container>
           <Header>
               {recipient? (
                   <Avatar src={recipient?.photoURL}/>

               ):(
                   <Avatar>{recipientEmail[0]}</Avatar>
               )}
               
            <HeaderInfomation>
                <h3>{recipientEmail}</h3>

                {recipientSnapshot ? (
                    <p>Last Active: {" "} {recipient?.lastSeen?.toDate() ? (
                        <TimeAgo datetime={recipient?.lastSeen?.toDate()}/>
                    ): "unavailable"}
                    </p>
                ):(
                    <p>Loading Last active...</p>
                )}
                
            </HeaderInfomation>

            <HearderIcons>
                <IconButton>
                    <AttachFileIcon/>
                </IconButton>

                <IconButton>
                    <MoreVertIcon/>
                </IconButton>
            </HearderIcons>

           </Header>
           <MessageContainer>
               {/* show message */}
               {showMessages()}
               <EndofMessage ref={endofMessagesRef}/>

           </MessageContainer>

           <InputContainer>
           <InsertEmoticonIcon/>
           <Input value={input} onChange={e=>setInput(e.target.value)}/>
           <button hidden disabled={!input} type='submit' onClick={sendMessage}>send Message</button>
           <MicIcon/>
           </InputContainer>
        </Container>
    )
}

export default ChatScreen;

const Container = styled.div`

`;

const Header = styled.div` 
display:flex;
align-items:center;
position:sticky;
background-color:white;
z-index:1;
padding:11px;
top:0;
height:80px;
border-bottom: 1px solid whitesmoke;

`;

const HeaderInfomation = styled.div`
padding:15px;
flex:1;
>h3{
    margin-bottom:3px;
}
>p{
    font-size:14px;
    color:gray;
}
`;

const HearderIcons = styled.div``;

const EndofMessage = styled.div`
margin-bottom:50px;
`;

const MessageContainer = styled.div`
padding:30px;
background-color:#ebded8;
min-height:90vh;

`;

const InputContainer =styled.form`
display:flex;
align-items:center;
padding:10px;
position:sticky;
bottom:0;
background-color:white;
z-index:100;
`;

const Input = styled.input`
flex:1;
outline:0;
border:none;
border-radius:10px;
padding:20px;
margin-left:15px;
margin-right:15px;
background-color:whitesmoke;

`;
