export const isJwtExpired = (token) => {
    try {
        const payloadBase64 = token.split(".")[1];
        const payload = JSON.parse(atob(payloadBase64));

        const expMs = payload.exp * 1000;
        return Date.now() >= expMs;
    } catch (e) {
        return true;
    }
};
