import React from 'react';

const Context = React.createContext();

export class StoreProvider extends React.Component {
    state = {
        isLogged: false,
        me: null,
        selectionID: null,
        selectionType: null,
    };

    changeStore = (name, value) => {
        this.setState({ [name]: value });
    };

    render() {
        return (
            <Context.Provider
                value={{ ...this.state, changeStore: this.changeStore }}
            >
                {this.props.children}
            </Context.Provider>
        );
    }
}

export default Context;
