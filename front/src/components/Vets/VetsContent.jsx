import React from 'react';
import { Grid, GridColumn, Segment } from 'semantic-ui-react';
import ActionMenu from '../Utility/ActionMenu';
import setHeaders from '../../utils/setHeaders';
import axios from 'axios';
import VetsTable from './VetsTable';
import Store from '../../Store';

class VetsContent extends React.Component {
    state = {
        results: [],
    };

    static contextType = Store;

    vetsTableRef = React.createRef();

    getVisits = async () => {
        await axios({
            method: 'get',
            url: '/vet-visits/vet/',
            headers: setHeaders(),
        }).then(
            response => {
                this.setState({ results: response.data });
            },
            error => {
                console.log(error);
            }
        );
    };

    componentDidMount() {
        this.context.changeStore('selectionType', 'vetVisits');
        this.getVisits();
    }

    componentDidUpdate() {
        this.vetsTableRef.current.setState({ results: this.state.results });
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
                            <Grid columns={16}>
                                <GridColumn width={2}>Nr</GridColumn>
                                <GridColumn width={5}>Description</GridColumn>
                                <GridColumn width={3}>Visit date</GridColumn>
                                <GridColumn width={3}>Animal</GridColumn>
                                <GridColumn width={3}>Visit state</GridColumn>
                            </Grid>
                        </Segment>
                        <VetsTable ref={this.vetsTableRef} />
                    </Segment>
                </GridColumn>
            </Grid>
        );
    }
}

export default VetsContent;
