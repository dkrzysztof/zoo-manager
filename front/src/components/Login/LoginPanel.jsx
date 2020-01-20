import React from 'react';
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react';


class LoginPanel extends React.Component {
    state = {
        username: '',
        password: '',
    };

    render() {
        return (
            <Grid centered>
                <Segment compact>
                    <Form error onSubmit={this.onButtonSubmit}>
                        <Header textAlign="center">Menedżer Ogrodu </Header>
                        <Header textAlign="center"> Zoologicznego </Header>
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
                        />
                        <Grid textAlign="center" padded>
                            <Button color="green" type="submit">
                                Submit
                            </Button>
                        </Grid>
                    </Form>
                </Segment>
            </Grid>
        );
    }
}

export default LoginPanel;
