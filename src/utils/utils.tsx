import { API_BASE_URL } from "../actions/apiActions";
import { STORY_DATA } from "../components/App/storyData";
import { Logger } from "../data/logger";

export function getStoryStep(sectionIndex: number, stepIndex: number) {
	if (STORY_DATA[sectionIndex]) {
		return STORY_DATA[sectionIndex].steps[stepIndex];
	} else {
		return undefined;
	};
}

export function imagePathToUrl(path: string) {
	// FIXME: This might not work depending on how images are served.
	return `${API_BASE_URL}/${path}`;
}
