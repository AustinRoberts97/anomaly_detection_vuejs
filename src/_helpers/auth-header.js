export function authHeader() {
    // return authorization header with jwt token
    let token = localStorage.getItem('access');
    
    if (token) {
        return { 'Authorization': 'Bearer ' + token };
    } else {
        return {};
    }
}