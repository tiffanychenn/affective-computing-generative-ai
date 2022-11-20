import * as React from 'react';
import { Logger } from '../../data/logger';
import { ReflectStep } from '../../data/story';
import { SectionImageUrls } from '../../reducers/promptReducer';
import { playerRoleToNumber, renderBoldText, replacePlayerText } from '../../utils/textUtils';
import { getSectionImageOrString } from '../../utils/utils';
import { STAR_BG } from '../App/storyData';
import { Panel } from '../atoms/containers/Panel';
import { BLUE_BG_LIGHT_SHADOW, IMG_BG_DARK_SHADOW } from '../atoms/image/ImageCard';
import { DiscussionPrompt, Hint, SerifHeader, Text } from '../atoms/text/Text';
import { BlankSlide } from '../organisms/BlankSlide';
import { BlankTwoColumnSlide } from '../organisms/BlankTwoColumnSlide';
import { ContentWithImageSlide } from '../organisms/ContentWithImageSlide';
import { LoadingImageCard } from '../organisms/LoadingImageCard';

interface Props {
	logger: Logger;
	step: ReflectStep;
	landscapePlayer: 1 | 2;
	sectionImageUrls: SectionImageUrls;
	onNext?: () => void;
	allowNext: boolean; // Delegated up to parent because of DALL-E and possible socket callback.
}

export class Reflect extends React.Component<Props> {
	render() {
		const { logger, step, landscapePlayer, sectionImageUrls, onNext, allowNext } = this.props;
		const playerNumber = playerRoleToNumber(step.player, landscapePlayer);
		
		const cardImage = getSectionImageOrString(step.cardImage, sectionImageUrls);
		// const boxShadow = typeof step.backgroundImage == 'number' ? IMG_BG_DARK_SHADOW : BLUE_BG_LIGHT_SHADOW;
		// const bgOpacity = typeof step.backgroundImage == 'number' ? 0.8 : 0.4;
		const bgOpacity = step.backgroundImage == STAR_BG ? 0.4 : 0.8;
		const boxShadow = step.backgroundImage == STAR_BG ? BLUE_BG_LIGHT_SHADOW : IMG_BG_DARK_SHADOW;

		const containerStyle: React.CSSProperties = {
			height: '70vh',
			flex: 1,
		};

		const contentStyle: React.CSSProperties = {
			display: 'flex',
			flexDirection: 'column',
			gap: '30px',
		};

		const content = <div style={containerStyle}>
			<Panel bgOpacity={bgOpacity}>
				<div style={contentStyle}>
					<Text>The wand starts swirling and whirling, and begins to frantically paint the landscape.</Text>
					<Text>While you wait...</Text>
					<DiscussionPrompt>{renderBoldText(replacePlayerText(step.question, playerNumber))}</DiscussionPrompt>
				</div>
			</Panel>
		</div>;

		// Two column layout always
		return <BlankTwoColumnSlide step={step}
									sectionImageUrls={sectionImageUrls}>{{
			col1: content,
			col2: <LoadingImageCard src={cardImage as string}
									allowNext={allowNext}
									onNext={onNext}
									buttonId={step.id + '-next-button'}
									logger={logger}
									boxShadow={boxShadow}/>
		}}</BlankTwoColumnSlide>;
	}
}
