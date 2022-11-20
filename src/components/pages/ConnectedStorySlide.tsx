import * as React from 'react';
import { connect } from 'react-redux';
import { advanceStep, redoSection } from '../../actions/gameActions';
import { Logger } from '../../data/logger';
import { ImageStep, InfoStep, ReflectStep, StoryStep, StoryStepType, TitleStep, WritePromptStep } from '../../data/story';
import { SectionImageUrls } from '../../reducers/promptReducer';
import { State } from '../../reducers/rootReducer';
import { getStoryStep } from '../../utils/utils';
import { Text } from '../atoms/text/Text';
import { BlankSlide } from '../organisms/BlankSlide';
import { DisplayGeneratedImage } from '../templates/DisplayGeneratedImage';
import { InfoSlide } from '../templates/InfoSlide';
import { Reflect } from '../templates/Reflect';
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
}

interface ReduxDispatchProps {
	advanceStep: (logger: Logger) => void;
	redoSection: () => void;
}

type Props = OwnProps & ReduxStateProps & ReduxDispatchProps;

const DUMMY_STEP: StoryStep = {
	type: StoryStepType.Info,
	id: 'dummy-step',
};

class ConnectedStorySlide extends React.Component<Props> {
	render() {
		const { sectionIndex, stepIndex, landscapePlayer, sectionImageUrls, logger, advanceStep, redoSection } = this.props;
		const step = getStoryStep(sectionIndex, stepIndex);
		// TODO: Ensure that index is still within bounds, maybe?
		switch (step.type) {
			case StoryStepType.WritePrompt:
				return <WritePrompt logger={logger}
									step={step as WritePromptStep}
									landscapePlayer={landscapePlayer}
									sectionImageUrls={sectionImageUrls}
									onNext={() => advanceStep(logger)}/>;
			case StoryStepType.Reflect:
				return <Reflect logger={logger}
								step={step as ReflectStep}
								landscapePlayer={landscapePlayer}
								sectionImageUrls={sectionImageUrls}
								allowNext={true} /*TODO*/
								onNext={() => advanceStep(logger)}/>;
			case StoryStepType.Image:
				return <DisplayGeneratedImage logger={logger}
											  step={step as ImageStep}
											  sectionImageUrls={sectionImageUrls}
											  onNext={() => advanceStep(logger)}
											  onRedo={redoSection}/>
			case StoryStepType.Title:
				return <TitleSlide 
											  logger={logger}
											  step={step as TitleStep}
											  onNext={() => advanceStep(logger)}
											  />
			case StoryStepType.Info:
				return <InfoSlide 
											  step={step as InfoStep}
											  sectionImageUrls={sectionImageUrls}
											  onNext={() => advanceStep(logger)}
											  logger={logger}
											  landscapePlayer={landscapePlayer}
											  />
			default:
				return <BlankSlide step={DUMMY_STEP} sectionImageUrls={[]}><Text>ERROR: Tried to display a story section that isn't yet implemented.</Text></BlankSlide>;
		}
	}
}

const mapStateToProps = (state: State): ReduxStateProps => ({
	sectionIndex: state.game.storySection,
	stepIndex: state.game.storyStep,
	landscapePlayer: state.game.landscapePlayer,
	sectionImageUrls: state.prompt.sectionImageUrls,
});

export default connect(mapStateToProps, {advanceStep, redoSection})(ConnectedStorySlide);
