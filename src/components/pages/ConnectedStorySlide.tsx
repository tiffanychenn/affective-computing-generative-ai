import * as React from 'react';
import { connect } from 'react-redux';
import { advanceStep, redoSection, setLandscapePlayer } from '../../actions/gameActions';
import { Logger } from '../../data/logger';
import { CustomFormStep, ImageStep, InfoStep, ReflectStep, RoleSelectStep, StoryStep, StoryStepType, TitleStep, WritePromptStep } from '../../data/story';
import { FetchStatus } from '../../reducers/apiReducer';
import { SectionImageUrls } from '../../reducers/promptReducer';
import { State } from '../../reducers/rootReducer';
import { getStoryStep } from '../../utils/utils';
import { DEBUG_MODE } from '../App/ParticipantApp';
import { PLACEHOLDER_IMG_URL } from '../App/storyData';
import { Text } from '../atoms/text/Text';
import { BlankSlide } from '../organisms/BlankSlide';
import { CustomFormSlide } from '../templates/CustomFormSlide';
import { DisplayGeneratedImage } from '../templates/DisplayGeneratedImage';
import { InfoSlide } from '../templates/InfoSlide';
import { Reflect } from '../templates/Reflect';
import { RoleSelectSlide } from '../templates/RoleSelectSlide';
import { TitleSlide } from '../templates/TitleSlide';
import { WritePrompt } from '../templates/WritePrompt';

interface OwnProps {
	logger: Logger;
}

interface ReduxStateProps {
	sectionIndex: number;
	stepIndex: number;
	landscapePlayer: 1 | 2;
	sectionImageUrls: SectionImageUrls;
	isFetchingImage: FetchStatus;
	hasUsedRedo: boolean;
}

interface ReduxDispatchProps {
	advanceStep: (logger: Logger, experimentId?: string, firstPlayerId?: string, secondPlayerId?: string) => void;
	redoSection: () => void;
	setLandscapePlayer: (value: 1 | 2) => void;
}

type Props = OwnProps & ReduxStateProps & ReduxDispatchProps;

const DUMMY_STEP: StoryStep = {
	type: StoryStepType.Info,
	id: 'dummy-step',
};

class ConnectedStorySlide extends React.Component<Props> {
	render() {
		const { sectionIndex, stepIndex, landscapePlayer, sectionImageUrls, logger, isFetchingImage, hasUsedRedo, advanceStep, redoSection, setLandscapePlayer } = this.props;
		const step = getStoryStep(sectionIndex, stepIndex);
		console.log('section image urls');
		console.log(sectionImageUrls);
		// TODO: Ensure that index is still within bounds, maybe?
		switch (step.type) {
			case StoryStepType.WritePrompt:
				return <WritePrompt
					logger={logger}
					step={step as WritePromptStep}
					landscapePlayer={landscapePlayer}
					sectionImageUrls={sectionImageUrls}
					onNext={() => advanceStep(logger)}/>;
			case StoryStepType.Reflect:
				return <Reflect
					logger={logger}
					step={step as ReflectStep}
					landscapePlayer={landscapePlayer}
					sectionImageUrls={sectionImageUrls}
					allowNext={DEBUG_MODE ? true : isFetchingImage == 'success'} /*TODO: Test*/
					onNext={() => advanceStep(logger)}/>;
			case StoryStepType.Image:
				return <DisplayGeneratedImage
					logger={logger}
					step={step as ImageStep}
					sectionImageUrls={sectionImageUrls}
					onNext={() => advanceStep(logger)}
					onRedo={redoSection}
					allowRedo={!hasUsedRedo}/>
			case StoryStepType.Title:
				return <TitleSlide 
					logger={logger}
					step={step as TitleStep}
					onNext={(experimentId: string, firstPlayerId: string, secondPlayerId: string) => advanceStep(logger, experimentId, firstPlayerId, secondPlayerId)}/>
			case StoryStepType.Info:
				return <InfoSlide 
					step={step as InfoStep}
					sectionImageUrls={sectionImageUrls}
					onNext={() => advanceStep(logger)}
					logger={logger}
					landscapePlayer={landscapePlayer}/>
			case StoryStepType.CustomForm:
				return <CustomFormSlide
					step={step as CustomFormStep}
					sectionImageUrls={sectionImageUrls}
					onNext={() => advanceStep(logger)}
					logger={logger}
					landscapePlayer={landscapePlayer}/>
			case StoryStepType.RoleSelect:
				return <RoleSelectSlide
					step={step as RoleSelectStep}
					logger={logger}
					onNext={landscapePlayer => {
						setLandscapePlayer(landscapePlayer);
						advanceStep(logger);
					}}/>
			default:
				return <BlankSlide step={DUMMY_STEP} sectionImageUrls={[]}><Text>ERROR: Tried to display a story section that isn't yet implemented.</Text></BlankSlide>;
		}
	}
}

const DEBUG_SECTION_IMAGE_URLS: SectionImageUrls = {
	0: { filledPrompt: 'placeholder', path: PLACEHOLDER_IMG_URL },
	1: { filledPrompt: 'placeholder', path: PLACEHOLDER_IMG_URL },
	2: { filledPrompt: 'placeholder', path: PLACEHOLDER_IMG_URL },
	3: { filledPrompt: 'placeholder', path: PLACEHOLDER_IMG_URL },
	4: { filledPrompt: 'placeholder', path: PLACEHOLDER_IMG_URL },
	5: { filledPrompt: 'placeholder', path: PLACEHOLDER_IMG_URL },
	6: { filledPrompt: 'placeholder', path: PLACEHOLDER_IMG_URL },
	7: { filledPrompt: 'placeholder', path: PLACEHOLDER_IMG_URL },
	8: { filledPrompt: 'placeholder', path: PLACEHOLDER_IMG_URL },
};

const mapStateToProps = (state: State): ReduxStateProps => ({
	sectionIndex: state.game.storySection,
	stepIndex: state.game.storyStep,
	landscapePlayer: state.game.landscapePlayer,
	sectionImageUrls: DEBUG_MODE ? DEBUG_SECTION_IMAGE_URLS : state.prompt.sectionImageUrls, // TODO: Test
	isFetchingImage: state.api.isFetchingImage,
	hasUsedRedo: state.game.hasUsedRedo,
});

export default connect(mapStateToProps, {advanceStep, redoSection, setLandscapePlayer})(ConnectedStorySlide);
