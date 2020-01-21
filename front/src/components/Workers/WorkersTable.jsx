import React from 'react';
import { Container } from 'semantic-ui-react';
import WorkerPattern from './WorkerPattern';

class WorkersTable extends React.Component {
  state = { 
      results: [] 
    };

  arrayToTable = arr => {
    let key = 0;
    return arr.map(elem => {
      return <WorkerPattern worker={elem} key={key++} />;
    });
  };

  render() {
    return <Container>{this.arrayToTable(this.state.results)}</Container>;
  }
}

export default WorkersTable;