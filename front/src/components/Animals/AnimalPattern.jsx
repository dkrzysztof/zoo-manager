import React from 'react';
import { Segment, Grid, GridColumn, Container } from 'semantic-ui-react';
import Store from '../../Store';

class AnimalPattern extends React.Component {
    state = {
        selected: false
    }

    static contextType = Store;

    handleClick = () => {
        let isSelected = !this.state.selected;
        this.setState({selected: isSelected});
        this.context.changeStore('selectionID', this.props.animal.animal_id);
        this.context.changeStore('selectionType', 'animal');
        console.log(this.context)
    }
    
    render() {
        return (
            <Container onClick={this.handleClick}>
            {this.context.selectionID !== this.props.animal.animal_id ? (
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
            ) : (
                <Segment inverted>
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
            )
            }
            </Container>
        );
    }
}

export default AnimalPattern;
