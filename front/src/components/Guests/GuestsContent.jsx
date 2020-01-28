import React from 'react';
import { Grid, Segment, GridColumn } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import Store from '../../Store';

class GuestsContent extends React.Component {
    state = {};

    static contextType = Store;

    render() {
        return (
            <Grid columns={3} divided>
                <Grid.Row>
                    <GridColumn>
                        <Segment>info</Segment>
                    </GridColumn>
                    <GridColumn>
                        <Segment>animal info</Segment>
                        <Segment>doctors</Segment>
                    </GridColumn>
                    <GridColumn>
                        <Segment>worksers</Segment>
                        <Segment>enclosures</Segment>
                    </GridColumn>
                </Grid.Row>
            </Grid>
        );
    }
}

export default GuestsContent;
