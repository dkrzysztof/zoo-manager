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
    { key: 'ctr', text: 'Caretaker', value: 'caretakers' },
    { key: 'vet', text: 'Vet', value: 'vets' },
    { key: 'adm', text: 'Admin', value: 'administrators' },
];

const shiftOptions = [
    { key: 'm', text: 'Morning', value: 'morning' },
    { key: 'e', text: 'Evening', value: 'evening' },
    { key: 'n', text: 'Night', value: 'night' },
];

const adminOptions = [
    { key: 'mgr', text: 'Manager', value: 'manager' },
    { key: 'wkr', text: 'Worker', value: 'worker' },
    { key: 'ldr', text: 'Leader', value: 'leader' },
];

const vetsOptions = [
    { key: 'ext', text: 'Exotic Animals', value: 'exotic_animal_veterinarian' },
    { key: 'equ', text: 'Equine', value: 'equine_medicine' },
    { key: 'aqu', text: 'Aquatic', value: 'aquatic_medicine' },
    { key: 'con', text: 'Conservation', value: 'conservation_medicine' },
    { key: 'bir', text: 'Birds', value: 'birds_medicine' },
    { key: 'car', text: 'Cardiology', value: 'cardiology' },
    { key: 'nut', text: 'Nutrition', value: 'nutrition' },
    { key: 'fel', text: 'Feline', value: 'feline_medicine' },
    { key: 'can', text: 'Canine', value: 'canine_medicine' },
    { key: 'fsh', text: 'Fish', value: 'fish_medicine' },
    {
        key: 'rep',
        text: 'Reptile and Amphibian',
        value: 'reptile_and_amphibian_medicine',
    },
];

class WorkerAddContent extends React.Component {
    state = {
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
        accountInfo: {},
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
                            {this.state.accountInfo.type === 'caretakers' ? (
                                <Form.Select
                                    control={Select}
                                    placeholder=""
                                    options={shiftOptions}
                                    label="Shift"
                                    name="shift"
                                    onChange={this.handleInputChangeAccount}
                                />
                            ) : null}
                            {this.state.accountInfo.type === 'vets' ? (
                                <Form.Select
                                    control={Select}
                                    placeholder=""
                                    options={vetsOptions}
                                    label="Specialty"
                                    name="vet_specialty"
                                    onChange={this.handleInputChangeAccount}
                                />
                            ) : null}
                            {this.state.accountInfo.type ===
                            'administrators' ? (
                                <Form.Select
                                    control={Select}
                                    placeholder=""
                                    options={adminOptions}
                                    label="Position"
                                    name="position"
                                    onChange={this.handleInputChangeAccount}
                                />
                            ) : null}
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

export default WorkerAddContent;
