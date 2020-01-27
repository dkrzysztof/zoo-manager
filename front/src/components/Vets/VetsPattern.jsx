import React from 'react';
import { Segment, Grid, GridColumn, Container } from 'semantic-ui-react';
import Store from '../../Store';

class VetsPattern extends React.Component {
    state = {
        selected: false,
    };

    static contextType = Store;

    handleClick = async () => {
        let isSelected = !this.state.selected;
        this.setState({ selected: isSelected });
        await this.context.changeStore(
            'selectionID',
            this.props.visit.visit_id
        );
        await this.context.changeStore('selectionType', 'vetVisits');
    };

    render() {
        return (
            <Container onClick={this.handleClick}>
                {this.context.selectionID !== this.props.visit.visit_id ? (
                    <Segment>
                        <Grid columns={16}>
                            <GridColumn width={2}>
                                {this.props.visit.visit_id}
                            </GridColumn>
                            <GridColumn width={5}>
                                {this.props.visit.description}
                            </GridColumn>
                            <GridColumn width={3}>
                                {this.props.visit.visit_date}
                            </GridColumn>
                            <GridColumn width={3}>
                                {this.props.visit.animal_id}
                            </GridColumn>
                            <GridColumn width={3}>
                                {this.props.visit.visit_state}
                            </GridColumn>
                        </Grid>
                    </Segment>
                ) : (
                    <Segment inverted>
                        <Grid columns={16}>
                            <GridColumn width={2}>
                                {this.props.visit.visit_id}
                            </GridColumn>
                            <GridColumn width={5}>
                                {this.props.visit.description}
                            </GridColumn>
                            <GridColumn width={3}>
                                {this.props.visit.visit_date}
                            </GridColumn>
                            <GridColumn width={3}>
                                {this.props.visit.animal_id}
                            </GridColumn>
                            <GridColumn width={3}>
                                {this.props.visit.visit_state}
                            </GridColumn>
                        </Grid>
                    </Segment>
                )}
            </Container>
        );
    }
}

export default VetsPattern;
