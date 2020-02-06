import React from 'react';
import { Grid, GridColumn, Segment } from 'semantic-ui-react';
import ActionMenu from '../Utility/ActionMenu';
import setHeaders from '../../utils/setHeaders';
import axios from 'axios';
import EnclosuresTable from './EnclosuresTable';
import Store from '../../Store';

class EnclosuresContent extends React.Component {
    state = {
        results: [],
    };

    static contextType = Store;

    enclosuresTableRef = React.createRef();

    getEnclosures = async () => {
        await axios({
            method: 'get',
            url: '/animal-places',
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
        this.context.changeStore('selectionType', 'enclosure');
        this.getEnclosures();
    }

    componentDidUpdate() {
        this.enclosuresTableRef.current.setState({
            results: this.state.results,
        });
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
                            <Grid columns={12}>
                                <GridColumn width={2}>Nr</GridColumn>
                                <GridColumn width={6}>Name</GridColumn>
                                <GridColumn width={4}>Condition</GridColumn>
                                <GridColumn width={4}>Capacity</GridColumn>
                            </Grid>
                        </Segment>
                        <EnclosuresTable ref={this.enclosuresTableRef} />
                    </Segment>
                </GridColumn>
            </Grid>
        );
    }
}

export default EnclosuresContent;
