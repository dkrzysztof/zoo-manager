import React from 'react';
import { Icon, Grid, Container, GridColumn, Label} from 'semantic-ui-react';
import Store from '../../Store';

class WorkerInfo extends React.Component {
    state = {
        name: '',
        surname: '',
        phoneNumber: '',
        email: "malpa@gg.wp",
        accType: '',
        city: ''
    };

    static contextType = Store;

    getAccType = async () => {
        if(this.context.me.vet && !this.context.me.administrator && !this.context.me.caretaker){
            this.setState({accType: "Vet"});
        }else if(this.context.me.caretaker  && !this.context.me.administrator && this.context.me.vet){
            this.setState({accType: "Caretaker"});
        }else if(this.context.me.administrator  && !this.context.me.vet && !this.context.me.caretaker){
            this.setState({accType: "Administrator"});
        }else if(this.context.me.vet && this.context.me.administrator && this.context.me.caretaker){
            this.setState({accType: "SuperUser"});
        }else{
            this.setState({accType: "Worker"});
        }
       
    }

    componentDidMount = async () => {
        await this.getAccType();
        this.setState({name: this.context.me.firstname, surname: this.context.me.lastname, phoneNumber: this.context.me.phonenumber, city: this.context.me.address.city});
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
                        <Label>{this.state.phoneNumber}</Label><br></br>
                            Phone number
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
                        <Label>{this.state.city}</Label><br></br>
                            City
                        </GridColumn>
                    </Grid.Row>
                </Grid>
            </Container>
        );
    }
}

export default WorkerInfo;
