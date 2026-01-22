//This is just to store data!

export const SERVER_ADDRESS = "http://localhost:3334";

export const user1 = {
  user_id: "1",
  user_name: "user_1",
  user_password: "User123!",
  user_email: "user1@user.user",
  user_token: "",
  user_public_key: "",
};

export const user2 = {
  user_id: "2",
  user_name: "user_2",
  user_password: "User123!",
  user_email: "user2@user.user",
  user_token: "",
  user_public_key: "",
};

export const conversation1 = {
  conversation_id: "1",
  conversation_name: "conversation_1",
  owner_id: "1",
};

//For testing purposes those will not be encrypted because encryption of keys is client side
export const member1 = {
  user_id: "1",
  conversation_id: "1",
  decrypt_key: "",
  decrypt_iv: "",
};

//For testing purposes those will not be encrypted because encryption of messages is client side
export const message1 = {
  message_id: "1",
  message_content: "My message.",
  message_tag: "Tag resulting from encryption :(",
  in_response_to: "0",
  user_id: "1",
  conversation_id: "1",
};

export const blog1 = {
  blog_id: "1",
  blog_content: "I am user 1",
};

export const comment1 = {
  comment_id: "1",
  comment_content: "I am a comment",
  in_response_to: "0",
  user_id: "1",
  blog_id: "1",
};

export const comment2 = {
  comment_id: "2",
  comment_content: "I am a response to my comment",
  in_response_to: "1",
  user_id: "1",
  blog_id: "1",
};
