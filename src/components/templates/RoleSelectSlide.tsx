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
	error: string;
}

interface State {
	landscapePlayer: 1 | 2 | undefined;
}

const ROLE_SELECT_QUESTION_ID = "role-select-landscape";
const ROLE_SELECT_VALUE_P1 = "Player 1";
const ROLE_SELECT_VALUE_P2 = "Player 2";

export class RoleSelectSlide extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { landscapePlayer: 1 };
	}

	render() {
		const { logger, step, onNext, error } = this.props;
		const { landscapePlayer } = this.state;

		const fakeStep: CustomFormStep = {
			type: StoryStepType.CustomForm,
			id: 'role-select',
			backgroundImage: STAR_BG,
			player: 'both',
			playerAction: 'Discuss the following',
			requiredFormElemIds: ["world-tags", ROLE_SELECT_QUESTION_ID],
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
						<RadioGroup id={ROLE_SELECT_QUESTION_ID}
									logger={logger}
									ids={["role-select-landscape-p1", "role-select-landscape-p2"]}
									labels={[ROLE_SELECT_VALUE_P1, ROLE_SELECT_VALUE_P2]}
									orientation="horizontal"
									onSelect={value => this.setState({ landscapePlayer: value == ROLE_SELECT_VALUE_P1 ? 1 : 2 })}/>
					</QuestionGroup>
					<PageHeader>and who most enjoys to build?</PageHeader>
					{/* TODO: Figure out how to properly do this with UX. */}
					{/* <RadioGroup id="role-select-nature"
								logger={logger}
								ids={["role-select-landscape-p1", "role-select-landscape-p2"]}
								labels={["Player 1", "Player 2"]}
								orientation="horizontal"/> */}
				</>;
			},
		};

		return <CustomFormSlide step={fakeStep}
								logger={logger}
								onNext={() => onNext(landscapePlayer)}
								// Neither landscapePlayer nor sectionImageUrls will be used
								// here, so it's ok to use dummy values.
								landscapePlayer={1}
								sectionImageUrls={[]}
								error={error}/>
	}
}
