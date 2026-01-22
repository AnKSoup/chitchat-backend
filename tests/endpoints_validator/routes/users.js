// Focuses on user testing

import { call } from "../assets/api_caller.js";

const userRoute = "/user/";

// #1- Sign in:    POST    /user/                  REQ: {user_name, user_email, user_password}
export async function SignIn(user) {
  const testing = `Signing in ${user.user_name}`;
  try {
    const result = await call("POST", userRoute, {
      user_name: user.user_name,
      user_email: user.user_email,
      user_password: user.user_password,
    });
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}

// #2- Log in:     POST    /user/login             REQ: {user_email, user_password}
export async function LogIn(user) {
  const testing = `Logging in ${user.user_name}`;
  try {
    const result = await call("POST", userRoute + "login", {
      user_email: user.user_email,
      user_password: user.user_password,
    });
    user.user_token = result.content.user_token;
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}

// #3- Log out:    POST    /user/logout            REQ: {user_token}
export async function LogOut(user) {
  const testing = `Logging out ${user.user_name}`;
  try {
    const result = await call("POST", userRoute + "logout", {
      user_token: user.user_token,
    });
    user.user_token = "";
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}

// #4- Get by id:  GET     /user/:id
export async function GetByID(user) {
  const testing = `Getting user ${user.user_id}`; //Provided it exists of course
  try {
    const result = await call("GET", userRoute + user.user_id);
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}

// #5- Update:     PUT     /user/:id               REQ: {user_token, ..., !user_id, !user_password, !user_created_at}
export async function Update(user) {
  const testing = `Updating ${user.user_name} to changed_` + user.user_id;
  try {
    const result = await call("PUT", userRoute + user.user_id, {
      user_name: "changed_1",
      user_token: user.user_token,
    });
    user.user_name = "changed_" + user.user_id;
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}

// #6- Delete:     DELETE  /user/:id               REQ: {user_token}
export async function Delete(user) {
  const testing = `Deleting ${user.user_name}`;
  try {
    const result = await call("DELETE", userRoute + user.user_id, {
      user_token: user.user_token,
    });
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}

// #7- Get id:     POST    /user/get_id            REQ: {user_token}
export async function GetID(user) {
  const testing = `Getting id of ${user.user_name}`;
  try {
    const result = await call("POST", userRoute + "get_id", {
      user_token: user.user_token,
    });
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}

// #0- Get my info:POST    /user/:id               REQ: {user_token}                                                   RES: {user_name,user_email,user_created_at}
export async function GetMyInfo(user) {
  const testing = `Getting personal info of ${user.user_name}`;
  try {
    const result = await call("POST", userRoute + user.user_id, {
      user_token: user.user_token,
    });
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}

// #8- Get b name: GET     /user/search/:username                                                                      RES: {user_id, user_name|message}
export async function Search(user) {
  const testing = `Searching ${user.user_name}`; //Provided it exists of course
  try {
    const result = await call("GET", userRoute + "search/" + user.user_name);
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}

// #9- Chang pass: PUT     /user/change_pass/:id   REQ: {user_token, user_password}                                    RES: {message}
export async function ChangePass(user) {
  const testing = `Changing Password of ${user.user_name} to User1234!`;
  try {
    const result = await call(
      "PUT",
      userRoute + "change_pass/" + user.user_id,
      {
        user_token: user.user_token,
        user_password: "User1234!",
      },
    );
    user.user_password = "User1234!";
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}
