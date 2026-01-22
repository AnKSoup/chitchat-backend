import { CreateBlog1, EditBlog1, GetBlog1 } from "../routes/blogs.js";
import {
  DeleteComment,
  EditComment,
  GetComment,
  GetCommentsFrom,
  WriteComment,
} from "../routes/comments.js";
import {
  CreateConv,
  DeleteConv,
  GetConv,
  GetMembersOf,
  UpdateConv,
} from "../routes/conversations.js";
import { GenerateKeys } from "../routes/encryption.js";
import {
  GetAllConvOf,
  GetKeyIv,
  JoinChat,
  LeaveChat,
  RejoinChat,
} from "../routes/members.js";
import {
  DeleteMessage1,
  EditMessage1,
  GetAllMessagesOf,
  WriteMessage1,
} from "../routes/messages.js";
import {
  ChangePass,
  Delete,
  GetByID,
  GetID,
  GetMyInfo,
  LogIn,
  LogOut,
  Search,
  SignIn,
  Update,
} from "../routes/users.js";
import {
  blog1,
  comment1,
  comment2,
  conversation1,
  member1,
  user1,
  user2,
} from "./data.js";

const date = new Date();

//Add tests here
const arrayOfResult = [
  //user1 tests
  await SignIn(user1),
  await LogIn(user1),
  await GetID(user1),
  await Update(user1),
  await LogOut(user1),
  await LogIn(user1),
  await Search(user1),
  await GetByID(user1),
  await GetMyInfo(user1),
  await ChangePass(user1),
  await LogIn(user1),

  //user2 tests
  await SignIn(user2),
  await LogIn(user2),

  //conversation1 + members tests
  await CreateConv(conversation1, member1),

  await JoinChat(user1),
  await JoinChat(user2),
  await LeaveChat(user2),
  await RejoinChat(user2),

  await GetKeyIv(user1),

  await UpdateConv(conversation1),
  await GetConv(conversation1),

  await GetAllConvOf(user1),
  await GetMembersOf(conversation1),

  //message1 tests:
  await WriteMessage1(conversation1),
  await EditMessage1(conversation1),
  await GetAllMessagesOf(conversation1),

  //blog1 tests:
  await CreateBlog1(),
  await EditBlog1(),
  await GetBlog1(),

  //comments tests
  await WriteComment(comment1),
  await WriteComment(comment2),
  await EditComment(comment1),
  await GetComment(comment1),
  await GetCommentsFrom(blog1),

  //encryption tests
  await GenerateKeys(),

  //Deleting and cleaning
  await DeleteMessage1(conversation1),
  await DeleteConv(conversation1),
  await DeleteComment(comment2),
  await Delete(user1),
  await Delete(user2),
];

export async function FormatResponses() {
  let result = "";

  let failedRequestsNumber = 0;
  let failedRequests = "";

  for (let i = 0; i < arrayOfResult.length; i++) {
    //Gets rid of Testing...
    const object = { ...arrayOfResult[i] };
    delete object.Testing;
    //Appends result
    result += `#${i + 1}: ${arrayOfResult[i].Testing}:\n`;
    result += `${JSON.stringify(object, null, " ")}\n\n`;
    //If failed appends fail:
    if (!object.success) {
      failedRequestsNumber++;
      failedRequests += `#${i + 1}: ${arrayOfResult[i].Testing},\n`;
    }
  }

  return `Date of test : ${date.toUTCString()}

WARNING: Make sure db is empty before testing! 
WARNING: None of the encryption is being tested here, it's the client's matter

NUMBER OF FAILED TESTS: ${failedRequestsNumber}:
${failedRequests}

DETAILS OF REQUESTS:

${result}`;
}
