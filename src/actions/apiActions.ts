import { Logger } from "../data/logger";
import { FetchStatus } from "../reducers/apiReducer";
import { RootThunkAction } from "../reducers/rootReducer";
import { saveImage } from "./promptActions";

export const API_ACTION_NAMES = {
	SET_IS_FETCHING_IMAGE: 'SET_IS_FETCHING_IMAGE',
};

export const API_BASE_URL = "http://localhost:5000";

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
		dispatch(setIsFetchingImage('fetching'));

		const state = getState();
		const body = {
			sectionIndex,
			prompt,

			id: state.prompt.experimentId,
			firstPlayerId: state.prompt.firstPlayerId,
			secondPlayerId: state.prompt.secondPlayerId,
			loggingData: logger.dumpData(),
			images: state.prompt.sectionImageUrls,
		};

		fetch(`${API_BASE_URL}/image-gen`, {
			method: 'POST',
			body: JSON.stringify(body),
		}).then((response) => response.json())
		.then((data) => {
			const returnedImgPath = data.imageURL;
			dispatch(saveImage(sectionIndex, prompt, returnedImgPath));
			dispatch(setIsFetchingImage('success'));
		}).catch(reason => {
			const msg = "API failed to generate image for prompt: " + prompt + "\nReason: " + reason;
			console.error(msg);
			throw new Error(msg);
		});
	};
}

export function pushExperimentData(logger: Logger): RootThunkAction {
	return async (dispatch, getState) => {
		const state = getState();
		const body = {
			id: state.prompt.experimentId,
			firstPlayerId: state.prompt.firstPlayerId,
			secondPlayerId: state.prompt.secondPlayerId,
			loggingData: logger.dumpData(),
			images: state.prompt.sectionImageUrls,
		};

		fetch(`${API_BASE_URL}/experiment`, {
			method: 'POST',
			body: JSON.stringify(body),
		}).then(res => {
			if (res.status !== 200) {
				const msg = `API failed (status ${res.status}) to store experiment data for experiment ID ${state.prompt.experimentId}.`;
				console.error(msg);
				throw new Error(msg);
			}
		}).catch(reason => {
			const msg = `API failed to store experiment data for experiment ID ${state.prompt.experimentId}. Reason: ${reason}`;
		});
	};
}

export type APIActions = SetIsFetchingImageAction;
