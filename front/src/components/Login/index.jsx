import React from 'react';
import { BrowserRouter, Switch} from 'react-router-dom';
import { Container} from 'semantic-ui-react';

const LoginContent = () => {
  return (
    <BrowserRouter>
      <Container text>
        <Switch>
        </Switch>
      </Container>
    </BrowserRouter>
  );
};

export default LoginContent;