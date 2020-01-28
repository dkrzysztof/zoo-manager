import React from 'react';
import {
    Container,
    Icon,
    Header,
    Grid,
    Form,
    Input,
    Button,
    Select,
    Divider,
    Segment,
} from 'semantic-ui-react';
import Store from '../../Store';
import axios from 'axios';
import setHeaders from '../../utils/setHeaders';

class SettingsContent extends React.Component {
    state = {
        id: '',
        username: '',
        password: '',
        addressInfo: {
            street: '',
            buildingNumber: '',
            flatNumber: '',
            city: '',
            postCode: '',
            country: '',
        },
        workerInfo: { firstname: '', lastname: '', phonenumber: '' },
    };

    static contextType = Store;

    handleInputChange = (e, { name, value }) =>
        this.setState({ [name]: value });

    handleInputChangeAddress = (e, { name, value }) =>
        this.setState({
            addressInfo: { ...this.state.addressInfo, [name]: value },
        });

    handleInputChangeWorker = (e, { name, value }) =>
        this.setState({
            workerInfo: { ...this.state.workerInfo, [name]: value },
        });

    onButtonClick = async () => {
        await axios({
            url: '/users',
            method: 'put',
            data: this.state,
            headers: setHeaders(),
        }).then(
            res => {
                console.log(res.status);
            },
            err => {
                console.log(err.message);
            }
        );
    };

    componentDidMount() {
        this.setState({ id: this.context.me.worker_id });
    }

    render() {
        return (
            <Container>
                <Container textAlign="center">
                    <Header size="large" textAlign="center">
                        Edit your account
                    </Header>
                    <Icon name="users" color="blue" size="massive"></Icon>
                </Container>
                <Form>
                    <Divider horizontal>
                        <Header as="h4">
                            <Icon name="tag" />
                            Account
                        </Header>
                    </Divider>
                    <Grid columns={16}>
                        <Grid.Column width={8}>
                            <Form.Field
                                control={Input}
                                placeholder="Username"
                                label="Username"
                                name="username"
                                onChange={this.handleInputChange}
                            />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Form.Field
                                control={Input}
                                placeholder="Password"
                                label="Password"
                                name="password"
                                onChange={this.handleInputChange}
                            />
                        </Grid.Column>
                    </Grid>
                    <Divider horizontal>
                        <Header as="h4">
                            <Icon name="info" />
                            Informations
                        </Header>
                    </Divider>

                    <Grid columns={16}>
                        <Grid.Column width={8}>
                            <Form.Field
                                control={Input}
                                placeholder="First Name"
                                label="First Name"
                                name="firstname"
                                onChange={this.handleInputChangeWorker}
                            />
                            <Form.Field
                                control={Input}
                                placeholder="Phonenumber"
                                label="Phonenumber"
                                name="phonenumber"
                                onChange={this.handleInputChangeWorker}
                            />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Form.Field
                                control={Input}
                                placeholder="Last Name"
                                label="Last Name"
                                name="lastname"
                                onChange={this.handleInputChangeWorker}
                            />
                        </Grid.Column>
                    </Grid>
                    <Divider horizontal>
                        <Header as="h4">
                            <Icon name="address card" />
                            Address
                        </Header>
                    </Divider>
                    <Grid columns={16}>
                        <Grid.Column width={8}>
                            <Form.Field
                                control={Input}
                                placeholder="Street"
                                label="Street"
                                name="street"
                                onChange={this.handleInputChangeAddress}
                            />
                            <Form.Field
                                control={Input}
                                placeholder="City"
                                label="City"
                                name="city"
                                onChange={this.handleInputChangeAddress}
                            />
                            <Form.Field
                                control={Input}
                                placeholder="Country"
                                label="Country"
                                name="country"
                                onChange={this.handleInputChangeAddress}
                            />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Form.Group widths="2">
                                <Form.Field
                                    control={Input}
                                    placeholder="Building Number"
                                    label="Building Number"
                                    name="buildingNumber"
                                    onChange={this.handleInputChangeAddress}
                                />
                                <Form.Field
                                    control={Input}
                                    placeholder="Flat Number"
                                    label="Flat Number"
                                    name="flatNumber"
                                    onChange={this.handleInputChangeAddress}
                                />
                            </Form.Group>
                            <Form.Field
                                control={Input}
                                placeholder="Post code"
                                label="Post code"
                                name="postCode"
                                onChange={this.handleInputChangeAddress}
                            />
                        </Grid.Column>
                    </Grid>
                </Form>
                <br></br>
                <Button type="submit" onClick={this.onButtonClick}>
                    Add
                </Button>
            </Container>
        );
    }
}

export default SettingsContent;
