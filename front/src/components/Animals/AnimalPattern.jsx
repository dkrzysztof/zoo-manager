import React from 'react';
import { Segment, Grid, GridColumn } from 'semantic-ui-react';

class AnimalPattern extends React.Component {
    
    render() {
        return (
            <Segment>
                <Grid columns={16}>
                    <GridColumn width={2}>
                        {this.props.animal.animal_id}
                    </GridColumn>
                    <GridColumn width={3}>
                        {this.props.animal.species}
                    </GridColumn>
                    <GridColumn width={3}>{this.props.animal.name}</GridColumn>
                    <GridColumn width={3}>
                        {this.props.animal.birth_date}
                    </GridColumn>
                    <GridColumn width={3}>
                        {this.props.animal.health}
                    </GridColumn>
                    <GridColumn width={2}>{this.props.animal.age}</GridColumn>
                </Grid>
            </Segment>
        );
    }
}

export default AnimalPattern;
