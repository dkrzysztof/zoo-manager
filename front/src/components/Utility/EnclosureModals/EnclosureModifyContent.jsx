import React from 'react';
import {
    Container,
    Icon,
    Header,
    Form,
    Input,
    Button,
    Select,
} from 'semantic-ui-react';
import Store from '../../../Store';
import axios from 'axios';
import setHeaders from '../../../utils/setHeaders';

const conditionOptions = [
    { key: 'vp', text: 'Very Poor', value: 'very_poor' },
    { key: 'p', text: 'Poor', value: 'poor' },
    { key: 'f', text: 'Fair', value: 'fair' },
    { key: 'g', text: 'Good', value: 'good' },
    { key: 'vg', text: 'Very Good', value: 'very_good' },
];

class EnclosureModifyContent extends React.Component {
    state = {
        id: '',
        name: '',
        place_condition: '',
        capacity: '',
    };
    static contextType = Store;

    handleInputChange = (e, { name, value }) =>
        this.setState({ [name]: value });

    onButtonClick = async () => {
        await axios({
            url: `/animal-places/${this.state.id}`,
            method: 'put',
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

    componentDidMount() {
        this.setState({ id: this.context.selectionID });
    }

    componentDidUpdate() {
        console.log(this.state);
    }

    render() {
        return (
            <Container>
                <Container textAlign="center">
                    <Header size="large" textAlign="center">
                        Edit Animal Place
                    </Header>
                    <Icon
                        name="chess board"
                        color="brown"
                        size="massive"
                    ></Icon>
                </Container>
                <Form>
                    <Form.Field
                        control={Input}
                        placeholder="Name"
                        label="Name"
                        name="name"
                        onChange={this.handleInputChange}
                    />
                    <Form.Select
                        control={Select}
                        placeholder=""
                        options={conditionOptions}
                        label="Place condition"
                        name="place_condition"
                        onChange={this.handleInputChange}
                    />
                    <Form.Field
                        type="number"
                        control={Input}
                        placeholder="Capacity"
                        label="Capacity"
                        name="capacity"
                        onChange={this.handleInputChange}
                    />
                </Form>
                <Button type="submit" onClick={this.onButtonClick}>
                    Add
                </Button>
            </Container>
        );
    }
}

export default EnclosureModifyContent;
