import { DEBUG_MODE } from "../components/App/ParticipantApp";
import { Logger } from "../data/logger";
import { FetchStatus } from "../reducers/apiReducer";
import { RootThunkAction } from "../reducers/rootReducer";
import { loadExistingGame, setError } from "./gameActions";
import { initExperiment, saveImage } from "./promptActions";

export const API_ACTION_NAMES = {
	SET_IS_FETCHING_IMAGE: 'SET_IS_FETCHING_IMAGE',
};

const PORT = 4000;
export const API_BASE_URL = `http://localhost:${PORT}`;

export interface SetIsFetchingImageAction {
	type: typeof API_ACTION_NAMES.SET_IS_FETCHING_IMAGE;
	value: FetchStatus;
}

function setIsFetchingImage(value: FetchStatus): SetIsFetchingImageAction {
	return {
		type: API_ACTION_NAMES.SET_IS_FETCHING_IMAGE,
		value,
	};
}

export function generateImage(sectionIndex: number, prompt: string, logger: Logger): RootThunkAction {
	return async (dispatch, getState) => {
		if (DEBUG_MODE) return;

		dispatch(setIsFetchingImage('fetching'));

		const state = getState();
		const body = {
			sectionIndex,
			prompt,
			hasUsedRedo: state.game.hasUsedRedo,

			id: state.prompt.experimentId,
			firstPlayerId: state.prompt.firstPlayerId,
			secondPlayerId: state.prompt.secondPlayerId,
			loggingData: logger.dumpData(),
			images: state.prompt.sectionImageUrls,
		};

		fetch(`${API_BASE_URL}/image-gen`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
				},
		}).then((response) => response.json())
		.then((data) => {
			const returnedImgPath = data.imageURL;
			dispatch(saveImage(sectionIndex, prompt, returnedImgPath));
			dispatch(setIsFetchingImage('success'));
		}).catch(reason => {
			const msg = "API failed to generate image for prompt: " + prompt + "\nReason: " + reason;
			console.error(msg);
			dispatch(setError(msg));
			throw new Error(msg);
		});
	};
}

export function initExperimentData(experimentId: string, firstPlayerId: string, secondPlayerId: string, experimentType: string, logger: Logger): RootThunkAction {
	return async (dispatch, getState) => {
		if (DEBUG_MODE) {
			dispatch(initExperiment(experimentId, firstPlayerId, secondPlayerId, experimentType));
			return;
		}

		const state = getState();
		const body = {
			id: experimentId,
			firstPlayerId: firstPlayerId,
			secondPlayerId: secondPlayerId,
			loggingData: logger.dumpData(),
			images: state.prompt.sectionImageUrls,
			sectionIndex: state.game.storySection,
			stepIndex: state.game.storyStep,
			experimentType: experimentType
		};

		fetch(`${API_BASE_URL}/startExperiment`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
				},
		})
		.then((response) => response.json())
		.then(data => {
			dispatch(initExperiment(experimentId, firstPlayerId, secondPlayerId, experimentType));
			if (data.isExistingExperiment) {
				logger.loadPreviousExperimentData(data.experimentData.loggingData);
				Object.keys(data.experimentData.images).forEach((sectionIndex) => {
					const image = data.experimentData.images[sectionIndex];
					dispatch(saveImage(parseInt(sectionIndex), image.filledPrompt, image.path))
				});
				dispatch(loadExistingGame(data.experimentData.sectionIndex, data.experimentData.stepIndex));
			}
		}).catch(reason => {
			const msg = `API failed to initialize experiment data for experiment ID ${state.prompt.experimentId}. Reason: ${reason}`;
			dispatch(setError(msg));
			throw new Error(msg);
		});
	};
}

export function pushExperimentData(logger: Logger): RootThunkAction {
	return async (dispatch, getState) => {
		if (DEBUG_MODE) return;

		const state = getState();
		const body = {
			id: state.prompt.experimentId,
			firstPlayerId: state.prompt.firstPlayerId,
			secondPlayerId: state.prompt.secondPlayerId,
			loggingData: logger.dumpData(),
			images: state.prompt.sectionImageUrls,
			sectionIndex: state.game.storySection,
			stepIndex: state.game.storyStep,
			experimentType: state.prompt.experimentType,
		};

		fetch(`${API_BASE_URL}/experiment`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
			},
		}).then(res => {
			if (res.status !== 200) {
				const msg = `API failed (status ${res.status}) to store experiment data for experiment ID ${state.prompt.experimentId}.`;
				console.error(msg);
				dispatch(setError(msg));
				throw new Error(msg);
			}
		}).catch(reason => {
			const msg = `API failed to store experiment data for experiment ID ${state.prompt.experimentId}. Reason: ${reason}`;
		});
	};
}

export type APIActions = SetIsFetchingImageAction;
