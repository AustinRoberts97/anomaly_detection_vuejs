export function authHeader() {
    // return authorization header with jwt token
    let token = localStorage.getItem('token');
    
    if (token) {
        
        var access = JSON.parse(token).access;
        
        return { 'Authorization': 'Bearer ' + access };
    } else {
        return {};
    }
}