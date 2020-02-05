import React from 'react';
import {
    Container,
    Icon,
    Header,
    Button,
    Form,
    Input,
} from 'semantic-ui-react';
import Store from '../../../Store';
import axios from 'axios';
import setHeaders from '../../../utils/setHeaders';

class AnimalRemoveContent extends React.Component {
    state = {
        id: '',
    };
    static contextType = Store;

    handleInputChange = (e, { name, value }) =>
        this.setState({ [name]: value });

    onButtonClick = async () => {
        await axios({
            url: `/users/${this.state.id}`,
            method: 'delete',
            data: this.state,
            headers: setHeaders(),
        }).then(
            res => {
                console.log(res.status);
            },
            err => {
                console.log(err);
            }
        );
    };

    render() {
        return (
            <Container>
                <Container textAlign="center">
                    <Header size="large" textAlign="center">
                        Remove User
                    </Header>
                    <Icon name="users" color="blue" size="massive"></Icon>
                    <Form.Field
                        type="number"
                        control={Input}
                        placeholder="ID"
                        label="User ID:   "
                        name="id"
                        onChange={this.handleInputChange}
                    />
                    <Header size="medium" color="red">
                        Are you sure, you want to remove user with{' '}
                        {this.state.id} ID?
                    </Header>
                    <Button type="submit" onClick={this.onButtonClick}>
                        Remove
                    </Button>
                </Container>
            </Container>
        );
    }
}

export default AnimalRemoveContent;
