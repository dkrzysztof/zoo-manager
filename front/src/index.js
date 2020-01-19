import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import AppBar from './components/AppBar';
import Home from './views/Homepage';


const App = () => {
    return (
      <BrowserRouter>
        <Container >
          <AppBar />
          <Switch>
            <Route exact path="/" component={Home} /> 
          </Switch>
        </Container>
      </BrowserRouter>
    );
  };
  
  
  ReactDOM.render(
    <App /> , 
    document.querySelector('#root'),
  );