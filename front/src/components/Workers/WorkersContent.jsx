import React from 'react';
import { Grid, GridColumn, Segment } from 'semantic-ui-react';
import ActionMenu from '../Utility/ActionMenu';
import setHeaders from '../../utils/setHeaders';
import axios from 'axios';
import WorkersTable from './WorkersTable';
import Store from '../../Store';

class WorkersContent extends React.Component {
    state ={
        results: [],
    };
    
    static contextType = Store;
    
    workersTableRef = React.createRef();

    getWorkers = async () => {
        await axios({
            method:'get',
            url: '/workers',
            headers: setHeaders(),
        }).then(
            response => { this.setState({ results: response.data});
            }, error => {
                console.log(error);
            }
        );
    }

    componentDidMount() {
        this.context.changeStore('selectionType', 'worker');
        this.getWorkers();
    }

    componentDidUpdate() {
        this.workersTableRef.current.setState({ results: this.state.results });
    }

    render() {
        return (
            <Grid columns={16}>
                <GridColumn width={3}>
                    <ActionMenu />
                </GridColumn>
                <GridColumn width={12}>
                    <Segment inverted color="grey">
                        <Segment>
                        <Grid columns = {16}>
                                <GridColumn width={2}>
                                    Nr
                                </GridColumn>
                                <GridColumn width={3}>
                                    First Name
                                </GridColumn>
                                <GridColumn width={3}>
                                    Last Name
                                </GridColumn>
                                <GridColumn width={4}>
                                    Phone number
                                </GridColumn>
                                <GridColumn width={3}>
                                    Username
                                </GridColumn>
                            </Grid> 
                        </Segment>
                        <WorkersTable ref={this.workersTableRef} />
                    </Segment>
                </GridColumn>
            </Grid>
        );
    }
}

export default WorkersContent;
