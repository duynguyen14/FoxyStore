import axios from 'axios';

const API_URL = 'http://localhost:8080';

class AuthService {
  login() {
    const redirectUri = `${window.location.origin}/oauth2/redirect`;
    window.location.href = `http://localhost:8080/oauth2/authorize/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
  }

  getCurrentUser() {
    return axios.get(`${API_URL}/user/me`, {
      headers: { 'Authorization': 'Bearer ' + this.getToken() }
    });
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();
