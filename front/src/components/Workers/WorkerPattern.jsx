import React from 'react';
import { Segment, Grid, GridColumn } from 'semantic-ui-react';

class WorkerPattern extends React.Component {
    render() {
        return (
            <Segment>
                <Grid columns={16}>
                    <GridColumn width={2}>
                        {this.props.worker.worker_id}
                    </GridColumn>
                    <GridColumn width={3}>
                        {this.props.worker.firstname}
                    </GridColumn>
                    <GridColumn width={3}>
                        {this.props.worker.lastname}
                    </GridColumn>
                    <GridColumn width={4}>
                        {this.props.worker.phonenumber}
                    </GridColumn>
                    <GridColumn width={3}>
                        {this.props.worker.username}
                    </GridColumn>
                </Grid>
            </Segment>
        );
    }
}

export default WorkerPattern;
