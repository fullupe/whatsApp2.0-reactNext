import styled from "styled-components";
import Head from "next/head";
import Sidebar from "../../components/Sidebar";
import ChatScreen from "../../components/ChatScreen";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import getReceipientEmail from "../../components/Utils/getReceipientEmail";

function Chat({chat,messages}) {

    const [user]=useAuthState(auth)
    return (
        <Container>
            <Head>
                <title>Chat with {getReceipientEmail(chat.users, user)}</title>
            </Head>
            <Sidebar/>
            <ChatContaine>
                <ChatScreen chat={chat} messages={messages}/>
            </ChatContaine>
            
        </Container>
    )
}


export default Chat;

export async function getServerSideProps(context){
    const ref = db.collection("chats").doc(context.query.id);
    //PREP the message on the serverTimestamp

    const messagesRes = await ref
    .collection('messages')
    .orderBy('timestamp','asc')
    .get();

    const messages = messagesRes.docs.map(doc=>({
        id: doc.id,
        ...doc.data()
    })).map(messages=>({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime()
    }));
/// PREP the chat
    const chatRes = await ref.get();
    const chat ={
        id: chatRes.id,
        ...chatRes.data()
    };

    console.log(chat,messages)

    console.log("ok",messages)

    return{
        props:{
            messages: JSON.stringify(messages),
            chat:chat,
        },
    };
}



const Container = styled.div`
display: flex;
`;

const ChatContaine = styled.div`
flex:1;
overflow:scroll;
height:100vh;

::-webkit-scroll{
    display: none;
} 
 -ms-overflow-style: none;  /*IE and Edge */
 scrollbar-width: none; /* firefox */
`;

