const getReceipientEmail = (users, userLoggedIn)=>
    users?.filter(userToFiller => userToFiller !== userLoggedIn?.email)[0];

export default getReceipientEmail;
