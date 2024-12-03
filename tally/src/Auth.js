import axios from 'axios';

// Function to handle login
async function login(email, password) {
  try {
    const response = await axios.post('/login', { email, password });
    const { accessToken, refreshToken } = response.data;

    // Store the tokens in localStorage (or cookies)
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    console.log('Login successful:', response.data);
  } catch (error) {
    console.error('Login failed:', error);
  }
}

// Function to make an API request with the access token
async function makeApiRequest() {
  try {
    const response = await axios.get('/api/protected-resource', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Add access token
      },
    });

    console.log('API Response:', response.data);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Access token expired, attempt to refresh it
      await refreshAccessToken();
      // Retry the original request after refreshing the access token
      await makeApiRequest();
    } else {
      console.error('Error during API request:', error);
    }
  }
}

// Function to refresh the access token using the refresh token
async function refreshAccessToken() {
  try {
    const refreshToken = localStorage.getItem('refreshToken'); // Get the refresh token from storage

    if (!refreshToken) {
      console.error('No refresh token found');
      return;
    }

    const response = await axios.post('/refresh-token', { refreshToken });

    // Get the new access token from the response
    const { accessToken } = response.data;

    // Store the new access token in localStorage
    localStorage.setItem('accessToken', accessToken);
    console.log('Access token refreshed');
  } catch (error) {
    console.error('Error refreshing access token:', error);

    // Optionally log the user out if refresh fails (e.g., clear tokens)
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}

// Function to log out
function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  console.log('Logged out');
}


