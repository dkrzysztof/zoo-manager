import React from 'react';
import { Button, Form, Grid, Header, Segment, Container, Image } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

import Store from '../../Store';
import ErrorMessage from '../ErrorMessage';
const axios = require('axios');

class LoginPanel extends React.Component {
    state = {
        username: '',
        password: '',
        invalidData: null,
    };

    static contextType = Store;

    onButtonSubmit = async e => {
        e.preventDefault();
        const data = this.state;
        delete this.state['invalidData'];
        try {
            const res = await axios({
                method: 'post',
                url: '/login',
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(res.status);
            this.context.changeStore('me', res.data);
            if (res.status === 200) {
                this.context.changeStore('isLogged', true);
                this.setState({ isLogged: true });
            } else {
                this.setState({ invalidData: true });
            }
        } catch (error) {
            console.error('Error Login:', error);
            this.setState({ invalidData: true });
        }
    };

    onGuestButtonClick = (e) => {
        e.preventDefault();
        window.location.href= "guest"
    }

    loginValidate = e => {
        if (this.state.invalidData) {
            return <ErrorMessage message="Invalid email or password" />;
        } else {
            return null;
        }
    };

    render() {
        if (this.context.isLogged) return <Redirect to="/" />;
        return (
            <Container>
            <Grid centered>
            
                <Segment compact style={{marginTop: "5%", padding: "5%"}}>
                
                <Image src='https://i.imgur.com/BXOF58I.png' size='large' crossorigin="" />
                    <Form error onSubmit={this.onButtonSubmit}>
                       
                        <Form.Input
                            label="Username"
                            placeholder="Username"
                            name="username"
                            value={this.state.username}
                            onChange={e =>
                                this.setState({ username: e.target.value })
                            }
                        />
                        <Form.Input
                            label="Password"
                            placeholder="Password"
                            name="password"
                            type="password"
                            value={this.state.password}
                            onChange={e =>
                                this.setState({ password: e.target.value })
                            }
                            error={this.loginValidate()}
                        />
                        <Grid textAlign="center" padded>
                            <Button color="green" type="submit" id="przycisk">
                                Submit
                            </Button>
                        </Grid>
                    </Form>
                </Segment>
            </Grid>
           
            </Container>
        );
    }
}


//<Header textAlign="center">Menedżer Ogrodu </Header>
//<Header textAlign="center"> Zoologicznego </Header>
//<Button color="green" onClick={this.onGuestButtonClick}>
//Guest
//</Button>
export default LoginPanel;
