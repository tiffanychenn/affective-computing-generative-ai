import * as React from 'react';
import { Logger } from '../../data/logger';
import { CustomFormStep, RoleSelectStep, StoryStepType } from '../../data/story';
import { SectionImageUrls } from '../../reducers/promptReducer';
import { STAR_BG } from '../App/storyData';
import { GAP_BETWEEN_QUESTIONS, QuestionGroup } from '../atoms/containers/QuestionGroup';
import { RadioGroup } from '../atoms/input/RadioGroup';
import { TagGroup } from '../atoms/input/TagGroup';
import { PageHeader, TextSpacer, Error } from '../atoms/text/Text';
import { CustomFormSlide } from './CustomFormSlide';

interface Props {
	logger: Logger;
	step: RoleSelectStep;
	onNext?: (landscapePlayer: 1 | 2) => void;
	onBack?: () => void;
	error: string;
}

interface State {
	landscapePlayer: 1 | 2 | undefined;
}

const ROLE_SELECT_QUESTION_ID = "role-select";
const ROLE_SELECT_VALUE_P1 = "Player 1";
const ROLE_SELECT_VALUE_P2 = "Player 2";

export class RoleSelectSlide extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { landscapePlayer: 1 };
	}

	render() {
		const { logger, step, onNext, onBack, error } = this.props;
		const { landscapePlayer } = this.state;

		const fakeStep: CustomFormStep = {
			type: StoryStepType.CustomForm,
			id: 'role-select',
			backgroundImage: STAR_BG,
			player: 'both',
			playerAction: 'Discuss the following',
			requiredFormElemIds: ["world-tags"],
			maxWidthIfNoImageCard: false,
			itemSpacing: GAP_BETWEEN_QUESTIONS,
			makeContent: (logger, hasTimedOut, renderText) => {
				return <>
					<QuestionGroup>
						<PageHeader>What kind of world do you dream of building? Why?</PageHeader>
						<TagGroup id="world-tags"
								logger={logger}
								tags={step.tags}
								includeInput={true}
								placeholder="other..."/>
					</QuestionGroup>
					<QuestionGroup>
						<PageHeader>Between the two of you... who is closest to nature?</PageHeader>
						<RadioGroup id={ROLE_SELECT_QUESTION_ID + "-landscape"}
									logger={logger}
									ids={["role-select-landscape-p1", "role-select-landscape-p2"]}
									labels={[ROLE_SELECT_VALUE_P1, ROLE_SELECT_VALUE_P2]}
									orientation="horizontal"
									onSelect={value => this.setState({ landscapePlayer: value == ROLE_SELECT_VALUE_P1 ? 1 : 2 })}
									selected={this.state.landscapePlayer === 1 ? ROLE_SELECT_VALUE_P1 : (this.state.landscapePlayer === 2 ? ROLE_SELECT_VALUE_P2 : undefined)}/>
					<PageHeader>and who most enjoys to build?</PageHeader>
					<RadioGroup id={ROLE_SELECT_QUESTION_ID + "-buildings"}
								logger={logger}
								ids={["role-select-building-p1", "role-select-building-p2"]}
								labels={[ROLE_SELECT_VALUE_P1, ROLE_SELECT_VALUE_P2]}
								orientation="horizontal"
								onSelect={value => this.setState({ landscapePlayer: value == ROLE_SELECT_VALUE_P1 ? 2 : 1 })}
								selected={this.state.landscapePlayer === 1 ? ROLE_SELECT_VALUE_P2 : (this.state.landscapePlayer === 2 ? ROLE_SELECT_VALUE_P1 : undefined) }/>
					</QuestionGroup>
				</>;
			},
		};

		return <CustomFormSlide step={fakeStep}
								logger={logger}
								onNext={() => onNext(landscapePlayer)}
								onBack={() => onBack()}
								// Neither landscapePlayer nor sectionImageUrls will be used
								// here, so it's ok to use dummy values.
								landscapePlayer={1}
								sectionImageUrls={[]}
								error={error}/>
	}
}
