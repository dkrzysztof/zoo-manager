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
} from 'semantic-ui-react';
import Store from '../../../Store';
import axios from 'axios';
import setHeaders from '../../../utils/setHeaders';

const healthOptions = [
    { key: 'vp', text: 'Very Poor', value: 'very_poor' },
    { key: 'p', text: 'Poor', value: 'poor' },
    { key: 'f', text: 'Fair', value: 'fair' },
    { key: 'g', text: 'Good', value: 'good' },
    { key: 'vg', text: 'Very Good', value: 'very_good' },
];

class AnimalModifyContent extends React.Component {
    state = {
        id: '',
        name: '',
        species: '',
        birth_date: { year: '', month: '', day: '' },
        health: '',
        place_id: '',
    };
    static contextType = Store;

    handleInputChange = (e, { name, value }) =>
        this.setState({ [name]: value });

    handleInputChangeD = (e, { name, value }) =>
        this.setState({
            birth_date: { ...this.state.birth_date, [name]: value },
        });

    onButtonClick = async () => {
        await axios({
            url: `/animals/${this.state.id}`,
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
                        Edit Animal
                    </Header>
                    <Icon name="paw" color="green" size="massive"></Icon>
                </Container>
                <Form>
                    <Grid columns={16}>
                        <Grid.Column width={8}>
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
                                options={healthOptions}
                                label="Health"
                                name="health"
                                onChange={this.handleInputChange}
                            />
                        </Grid.Column>

                        <Grid.Column width={8}>
                            <Form.Field
                                control={Input}
                                placeholder="Species"
                                label="Species"
                                name="species"
                                onChange={this.handleInputChange}
                            />
                            <Form.Field
                                control={Input}
                                placeholder="Animal Place ID "
                                label="Place id"
                                name="place_id"
                                onChange={this.handleInputChange}
                            />
                        </Grid.Column>
                        <Grid.Column width={16}>
                            <Form.Group widths="3">
                                <Form.Field
                                    type="number"
                                    control={Input}
                                    placeholder="Day"
                                    label="Day of birth"
                                    name="day"
                                    onChange={this.handleInputChangeD}
                                />
                                <Form.Field
                                    type="number"
                                    control={Input}
                                    placeholder="Month"
                                    label="Month of birth"
                                    name="month"
                                    onChange={this.handleInputChangeD}
                                />
                                <Form.Field
                                    type="number"
                                    control={Input}
                                    placeholder="Year"
                                    label="Year of birth"
                                    name="year"
                                    onChange={this.handleInputChangeD}
                                />
                            </Form.Group>
                        </Grid.Column>
                    </Grid>
                </Form>

                <Button type="submit" onClick={this.onButtonClick}>
                    Add
                </Button>
            </Container>
        );
    }
}

export default AnimalModifyContent;
