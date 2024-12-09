import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../slices/authSlice';
import { Button } from '@chakra-ui/react';

const Auth = () => {
  const dispatch = useDispatch();

  const handleLoginSuccess = (response) => {
    const user = {
      name: response.profileObj.name,
      email: response.profileObj.email,
      avatarUrl: response.profileObj.imageUrl,
    };
    dispatch(loginSuccess(user));
  };

  const handleFailure = (error) => {
    console.error("Login failed", error);
  };

  return (
    <GoogleOAuthProvider clientId="571958543150-g9qo45jj4rrdorb7bcmdecdunffbfsrg.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onFailure={handleFailure}
        render={(renderProps) => (
          <Button onClick={renderProps.onClick} colorScheme="blue">
            Log in with Google
          </Button>
        )}
      />
    </GoogleOAuthProvider>
  );
};

export default Auth;
