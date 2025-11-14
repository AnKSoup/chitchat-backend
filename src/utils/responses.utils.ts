// Internal Response Object

// IRO ctor:
export function iro(
  success: boolean,
  title: string,
  status: number,
  detail: string,
  content?: object
) {
  return {
    success: success, // Bool to tell if operation succeeded.
    title: title, // Should tell briefly chat happens.
    status: status, // Also figuring in the .send(XXX).
    detail: detail, // Explains why.
    content: content, // Data requested
  };
}

// To easely check for property. (because typescript..)
export function getProperty(property: string, object: object) {
  if (property in object) {
    const key = property as keyof typeof object; // HUH ??
    return object[key];
  } else return null; //Not found
}

//Mainly always checking for success so might as well make the code easier to read:
export function getSuccess(object: object) {
  return getProperty("success", object) as unknown as boolean;
}

// To easely check for status. (because typescript..)
export function getStatus(object: object) {
  if ("status" in object) {
    const key = "status" as keyof typeof object; // HUH ??
    return object[key] as number;
  } else return 500; //Not IRO
}
