export default function formChecks(email: string, username: string, password: string) {
    if (username === "NONE") {
        if (email === "" || password === "") {
            return "empty field";
        } else if (password.length < 6) {
            return "password too short";
        };
    } else if (email === "" || username === "" || password === "") {
        return "empty field";
    } else if (password.length < 6) {
        return "password too short";
    };

    return true;
}