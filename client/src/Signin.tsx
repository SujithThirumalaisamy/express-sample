import React, { useEffect } from 'react';

interface SigninProps {
  className?: string;
  buttonText?: string;
}

const Signin: React.FC<SigninProps> = () => {
  useEffect(() => {
    if (window.catalyst?.auth?.signIn) {
      window.catalyst.auth.signIn("signin-container");
    }
  }, []);

  return (
    <div id="signin-container"
    style={{
      display: "flex",
      flexDirection: "column",
      width: "100vw",
      height: "100vh"
    }}>
    </div>
  );
};

export default Signin;