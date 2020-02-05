import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch} from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import AppBar from './components/AppBar';
import Home from './views/Homepage';
import Animals from './views/Animals';
import Workers from './views/Workers';
import Enclosures from './views/Enclosures';
import Vets from './views/Vets';
import Settings from './views/Settings';
import Login from './views/Login';
import Guests from './views/Guests';
import { StoreProvider } from './Store';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
    return (
        <BrowserRouter>
            <Container>
                <AppBar />
                <Switch>
                    <PrivateRoute exact path="/" component={Home} />
                    <PrivateRoute exact path="/animals" component={Animals} />
                    <PrivateRoute exact path="/workers" component={Workers} />
                    <PrivateRoute exact path="/enclosures" component={Enclosures} />
                    <PrivateRoute exact path="/vets" component={Vets} />
                    <PrivateRoute exact path="/settings" component={Settings} />
                    <PublicRoute exact path="/login" component={Login} />
                    <PublicRoute exact path="/guest" component={Guests} />
                </Switch>
            </Container>
        </BrowserRouter>
    );
};

ReactDOM.render(
    <StoreProvider>
        <App />
    </StoreProvider>,
    document.querySelector('#root')
);
