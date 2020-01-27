import React from 'react';
import {
    Container,
    Icon,
    Header,
    Grid,
    Form,
    Input,
    Button,
} from 'semantic-ui-react';
import Store from '../../../Store';
import axios from 'axios';
import setHeaders from '../../../utils/setHeaders';

class VisitAddContent extends React.Component {
    state = {
        vet_id: '',
        animal_id: '',
        visit_date: { year: '', month: '', day: '', hour: '' },
        description: ''
    };
    static contextType = Store;

    handleInputChange = (e, { name, value }) =>
        this.setState({ [name]: value });

    handleInputChangeD = (e, { name, value }) =>
        this.setState({
            visit_date: { ...this.state.visit_date, [name]: value },
        });

    onButtonClick = async () => {
        await axios({
          url: '/vet-visits',
          method: 'post',
          data: this.state,
          headers: setHeaders(),
        }).then(res => {console.log(res.status)}, err => {console.log(err)});
    };

    componentDidUpdate() {
        console.log(this.state);
    }

    render() {
        return (
            <Container>
                <Container textAlign="center">
                    <Header size="large" textAlign="center">
                        Add New Visit
                    </Header>
                    <Icon
                        name="doctor"
                        color="grey"
                        size="massive"
                    ></Icon>
                </Container>
                <Form>
                    <Grid columns={16}>
                        <Grid.Column width={8}>
                            <Form.Field
                                control={Input}
                                placeholder="VetID"
                                label="VetID"
                                name="vet_id"
                                onChange={this.handleInputChange}
                            />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Form.Field
                                control={Input}
                                placeholder="AnimalID"
                                label="AnimalID"
                                name="animal_id"
                                onChange={this.handleInputChange}
                            />
                        </Grid.Column>
                        <Grid.Column width={16}>
                        <Form.Field
                                control={Input}
                                placeholder="Description"
                                label="Description"
                                name="description"
                                onChange={this.handleInputChange}
                            />
                            <Form.Group widths="3">
                                <Form.Field
                                    type='number'
                                    control={Input}
                                    placeholder="Hour"
                                    label="Hour of visit"
                                    name="hour"
                                    onChange={this.handleInputChangeD}
                                />
                                <Form.Field
                                    type='number'
                                    control={Input}
                                    placeholder="Day"
                                    label="Day of visit"
                                    name="day"
                                    onChange={this.handleInputChangeD}
                                />
                                <Form.Field
                                    type='number'
                                    control={Input}
                                    placeholder="Month"
                                    label="Month of visit"
                                    name="month"
                                    onChange={this.handleInputChangeD}
                                />
                                <Form.Field
                                    type='number'
                                    control={Input}
                                    placeholder="Year"
                                    label="Year of visit"
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

export default VisitAddContent;
