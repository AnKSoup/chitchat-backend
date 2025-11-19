// Internal Response Object
// IRO ctor:
export function iro(success, title, status, detail, content) {
    return {
        success: success, // Bool to tell if operation succeeded.
        title: title, // Should tell briefly chat happens.
        status: status, // Also figuring in the .send(XXX).
        detail: detail, // Explains why.
        content: content, // Data requested
    };
}
// To easily check for property. (because typescript..)
export function getProperty(property, object) {
    if (property in object) {
        const key = property; // HUH ??
        return object[key];
    }
    else
        return null; //Not found
}
//Mainly always checking for success so might as well make the code easier to read:
export function getSuccess(object) {
    return getProperty("success", object);
}
// To easily check for status. (because typescript..)
export function getStatus(object) {
    if ("status" in object) {
        const key = "status"; // HUH ??
        return object[key];
    }
    else
        return 500; //Not IRO
}
//# sourceMappingURL=responses.utils.js.map