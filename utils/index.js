import Cookies from 'js-cookie';

const TOKEN_COOKIE_NAME = 'dell_api_token';

export const getStoredToken = () => {
    return Cookies.get(TOKEN_COOKIE_NAME);
};

export  const storeToken = (token) => {
    Cookies.set(TOKEN_COOKIE_NAME, token, { expires: 1/24 });
};

export const fetchNewToken = async () => {
    try {
      const response = await fetch(
        "/api/asset/gettoken",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch token');
      }

      const data = await response.json();
      storeToken(data.token);
      return data.token;
    } catch (error) {
      console.error('Token fetch error:', error);
      throw error;
    }
  };

export const fetchAssetData = async (serialNumber) => {
    let token = getStoredToken();
    
    if (!token || isTokenExpired(token)) {
      token = await fetchNewToken();
    }

    const response = await fetch(`https://api.dell.com/assets/${serialNumber}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch asset details');
    }

    return await response.json();
};

export  const isTokenExpired = (token) => {
    if (!token) {
      return true;
    }
  
    try {
      const parts = token.split('.');
      
      if (parts.length !== 3) {
        console.log('Invalid token format');
        return true;
      }
  
      const payload = parts[1];
      
      const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      
      if (!decodedPayload.exp) {
        console.error('Token has no expiration');
        return true;
      }
  
      const currentTime = Math.floor(Date.now() / 1000);
      
      const bufferTime = 30;
      
      return decodedPayload.exp <= (currentTime + bufferTime);
      
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  };


  export const customDebounce = (func, delay) => {
    let timeoutId;
  
    return function (...args) {
      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
  
      // Set new timeout
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };