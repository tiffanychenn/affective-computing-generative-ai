import * as React from 'react';
import { Logger } from '../../data/logger';
import { renderBoldText } from '../../utils/textUtils';
import LongTextBox from '../atoms/input/LongTextBox';
import ShortTextBox from '../atoms/input/ShortTextBox';
import { Warning } from '../atoms/text/Text';

interface Props {
	length: 'short' | 'long';
	charLimit?: number;
	wordLimit?: number;
	hintText: string;

	id: string;
	logger: Logger;
	placeholder?: string;
	defaultValue?: string;

	onLimitEdge?: (overLimit: boolean) => void;
	onInput?: (value: string) => void;
}

interface State {
	chars: number;
	words: number;
}

const HINT_TEXT = "Keep your description concise. Focus on specific aspects of the space rather than broad concepts.";

export class LimitedTextBox extends React.Component<Props, State> {
	static defaultProps = { hintText: HINT_TEXT };

	constructor(props: Props) {
		super(props);
		this.state = {
			chars: 0,
			words: 0,
		};
	}

	private onInput(e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const { charLimit, wordLimit, onLimitEdge, onInput } = this.props;
		const { chars: prevChars, words: prevWords } = this.state;

		const val = e.currentTarget.value;
		const chars = val.length;
		const words = val.split(" ").filter(val => val !== "").length;

		this.setState({ chars, words }, () => {
			const overCharLimit = charLimit && chars > charLimit;
			const overWordLimit = wordLimit && words > wordLimit;
			const wasOverCharLimit = charLimit && prevChars > charLimit;
			const wasOverWordLimit = wordLimit && prevWords > wordLimit;
			const overLimit = overCharLimit || overWordLimit;
			const wasOverLimit = wasOverCharLimit || wasOverWordLimit;
			if (onLimitEdge && overLimit !== wasOverLimit) {
				onLimitEdge(overLimit || false);
			}
			if (onInput) onInput(val);
		});
	}

	render() {
		const { length, charLimit, wordLimit, id, logger, placeholder, defaultValue, hintText } = this.props;
		const { chars, words } = this.state;

		const approachingPercent = 0.75;
		const overCharLimit = charLimit && chars > approachingPercent * charLimit;
		const overWordLimit = wordLimit && words > approachingPercent * wordLimit;
		const showHint = overCharLimit || overWordLimit;

		let text = "";
		if (overWordLimit) {
			text += `*${words}/${wordLimit} words used.* `;
		} else {
			text += `*${chars}/${charLimit} characters used.* `;
		}
		text += hintText;

		const hint = showHint && <Warning>{renderBoldText(text)}</Warning>;

		const containerStyle: React.CSSProperties = {};

		if (length == 'short') {
			return <div style={containerStyle}>
				<ShortTextBox id={id} logger={logger} placeholder={placeholder} defaultValue={defaultValue} onInput={e => this.onInput(e)}/>
				{hint}
			</div>;
		} else {
			return <div style={containerStyle}>
				<LongTextBox id={id} logger={logger} placeholder={placeholder} defaultValue={defaultValue} onInput={e => this.onInput(e)}/>
				{hint}
			</div>;
		}
	}
}
