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
} from 'semantic-ui-react';
import Store from '../../../Store';
import axios from 'axios';
import setHeaders from '../../../utils/setHeaders';

const typeOptions = [
    { key: 'ctr', text: 'Caretaker', value: 'caretaker' },
    { key: 'vet', text: 'Vet', value: 'vet' },
    { key: 'adm', text: 'Admin', value: 'admin' },
];

class WorkerAddContent extends React.Component {
    state = {
        username: '',
        password: '',
        addressInfo: {
            street: '',
            building_number: '',
            city: '',
            post_code: '',
            country: '',
        },
        workerInfo: { firstname: '', lastname: '', phonenumber: '' },
        accountInfo: { type: '' },
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

    handleInputChangeAccount = (e, { name, value }) =>
        this.setState({
            accountInfo: { ...this.state.accountInfo, [name]: value },
        });

    onButtonClick = async () => {
        await axios({
            url: '/users',
            method: 'post',
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

    componentDidUpdate() {
        console.log(this.state);
    }

    render() {
        return (
            <Container>
                <Container textAlign="center">
                    <Header size="large" textAlign="center">
                        Add New User
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
                            <Form.Select
                                control={Select}
                                placeholder=""
                                options={typeOptions}
                                label="Account Type"
                                name="type"
                                onChange={this.handleInputChangeAccount}
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
                            <Icon name="tag" />
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
                            <Icon name="tag" />
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
                            <Form.Field
                                control={Input}
                                placeholder="Building Number"
                                label="Building Number"
                                name="building_number"
                                onChange={this.handleInputChangeAddress}
                            />
                            <Form.Field
                                control={Input}
                                placeholder="Post code"
                                label="Post code"
                                name="post_code"
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

export default WorkerAddContent;
