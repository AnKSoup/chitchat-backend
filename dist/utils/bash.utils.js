//To handle bash weird behavior:
//Mainly used with '$' so far because it would mess the hashed strings since bash would count those as arguments/flags or variables.
export function escapeChar(char, string) {
    return string.replaceAll(char, '\\' + char);
}
//# sourceMappingURL=bash.utils.js.map