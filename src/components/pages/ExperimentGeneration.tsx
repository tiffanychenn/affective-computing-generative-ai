import * as React from 'react';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { initExperiment } from '../../actions/promptActions';

interface ExperimentGeneratorState {
    experimentId: string,
    firstPlayerId: string,
    secondPlayerId: string
}

class ExperimentGenerator extends React.Component<{}, ExperimentGeneratorState> {
    constructor(props = {}) {
        super(props);
        this.state = {
            experimentId: "",
            firstPlayerId: "",
            secondPlayerId: ""
        };
    }

    onChange(e: React.ChangeEvent<HTMLInputElement>) {
        switch (e.target.name) {
            case "experiment-id": this.setState(() => ({
                experimentId: e.target.value
              }));
            case "first-player-id": this.setState(() => ({
                firstPlayerId: e.target.value
              }));
            case "second-player-id": this.setState(() => ({
                secondPlayerId: e.target.value
              }));
        } 
    }

    onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const experimentId = this.state.experimentId === "" ? uuidv4() : this.state.experimentId;
        const firstPlayerId = this.state.firstPlayerId === "" ? uuidv4() : this.state.firstPlayerId;
        const secondPlayerId = this.state.secondPlayerId === "" ? uuidv4() : this.state.secondPlayerId;
        initExperiment(experimentId, firstPlayerId, secondPlayerId);
    }

	render() {
        return <form onSubmit={(e) => this.onSubmit(e)}>
            <input type="text" id="experiment-id" name="experiment-id" onChange={(e) => this.onChange(e)} />
            <input type="text" id="first-player-id" name="first-player-id" onChange={(e) => this.onChange(e)} />
            <input type="text" id="second-player-id" name="second-player-id" onChange={(e) => this.onChange(e)} />
            <input type="submit" />
        </form>;
    }
}

export default ExperimentGenerator;