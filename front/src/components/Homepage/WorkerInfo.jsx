import React from 'react';
import { Icon, Grid, Container, GridColumn, Label} from 'semantic-ui-react';
import Store from '../../Store';

class WorkerInfo extends React.Component {
    state = {
        name: "Jan",
        surname: "Kowalski",
        birthDate: "23/23/23",
        email: "malpa@gg.wp",
        accType: "Pracownik",
        firstDay: "23/23/23",
    };

    static contextType = Store;

    componentDidMount(){
        this.setState({name: this.context.me.firstname, surname: this.context.me.lastname});
        console.log(this.context.me);
    }

    render() {
        return (
            <Container>
                <Grid textAlign="center">
                    <Grid.Row>
                        <Icon name="user" size="massive"></Icon>
                    </Grid.Row>
                </Grid>
                <Grid columns={2}>
                    <Grid.Row>
                        <GridColumn>
                            <Label>{this.state.name}</Label><br></br>
                            First name
                        </GridColumn>
                        <GridColumn>
                        <Label>{this.state.surname}</Label><br></br>
                            Last name
                        </GridColumn>
                    </Grid.Row>
                    <Grid.Row>
                        <GridColumn>
                        <Label>{this.state.birthDate}</Label><br></br>
                            Birth date
                        </GridColumn>
                        <GridColumn>
                        <Label>{this.state.email}</Label><br></br>
                            Email
                        </GridColumn>
                    </Grid.Row>
                    <Grid.Row>
                        <GridColumn>
                        <Label>{this.state.accType}</Label><br></br>
                            Account Type
                        </GridColumn>
                        <GridColumn>
                        <Label>{this.state.firstDay}</Label><br></br>
                            First day in zoo
                        </GridColumn>
                    </Grid.Row>
                </Grid>
            </Container>
        );
    }
}

export default WorkerInfo;
