import React from 'react';
import { Segment, Grid, GridColumn } from 'semantic-ui-react';

class EnclosurePattern extends React.Component {
    render() {
        return (
            <Segment>
                <Grid columns={12}>
                    <GridColumn width={2}>
                        {this.props.enclosure.place_id}
                    </GridColumn>
                    <GridColumn width={6}>
                        {this.props.enclosure.name}
                    </GridColumn>
                    <GridColumn width={4}>
                        {this.props.enclosure.place_condition}
                    </GridColumn>
                    <GridColumn width={4}>
                        {this.props.enclosure.capacity}
                    </GridColumn>
                </Grid>
            </Segment>
        );
    }
}

export default EnclosurePattern;
