import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import AppBar from './components/AppBar';
import Home from './views/Homepage';
import Animals from './views/Animals';
import Workers from './views/Workers';
import Enclosures from './views/Enclosures';
import Vets from './views/Vets';
import Settings from './views/Settings';
import Login from './views/Login';
import { StoreProvider } from './Store';


const App = () => {
    return (
      <BrowserRouter>
        <Container >
          <AppBar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/animals" component={Animals} />
            <Route exact path="/workers" component={Workers} />
            <Route exact path="/enclosures" component={Enclosures} />
            <Route exact path="/vets" component={Vets} />
            <Route exact path="/settings" component={Settings} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </Container>
      </BrowserRouter>
    );
  };
  
  
  ReactDOM.render(
    <StoreProvider>
      <App />
    </StoreProvider>
    , 
    document.querySelector('#root'),
  );