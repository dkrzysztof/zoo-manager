import React from 'react';
import { Container } from 'semantic-ui-react';
import VetsPattern from './VetsPattern';

class VetssTable extends React.Component {
  state = { 
      results: [] 
    };

  arrayToTable = arr => {
    let key = 0;
    return arr.map(elem => {
      return <VetsPattern visit={elem} key={key++} />;
    });
  };

  render() {
    return <Container>{this.arrayToTable(this.state.results)}</Container>;
  }
}

export default VetssTable;