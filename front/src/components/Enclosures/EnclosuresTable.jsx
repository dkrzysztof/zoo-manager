import React from 'react';
import { Container } from 'semantic-ui-react';
import EnclosurePattern from './EnclosurePattern';

class EnclosureTable extends React.Component {
    state = {
        results: [],
    };

    arrayToTable = arr => {
        let key = 0;
        return arr.map(elem => {
            return <EnclosurePattern enclosure={elem} key={key++} />;
        });
    };

    render() {
        return (
            <Container style={{ height: '80%', overflow: 'scroll' }}>
                {this.arrayToTable(this.state.results)}
            </Container>
        );
    }
}

export default EnclosureTable;
