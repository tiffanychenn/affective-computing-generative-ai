import * as React from 'react';
import { css } from '@emotion/react';
import { LoggedFormElementComponent, LoggedFormElementProps } from './LoggedFormElement';

export interface Props extends LoggedFormElementProps {
	placeholder?: string;
	defaultValue?: string;
	onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
}

export default class ShortTextBox extends LoggedFormElementComponent<Props> {
	render() {
		const { placeholder, defaultValue, onInput } = this.props;

		const style = css({
			background: '#0A1547',
			color: 'white',
			border: 'none',
			fontFamily: 'PT Sans',
			fontSize: '24px',
			fontWeight: '400', // normal
			"::placeholder": {
				color: '#343B77',
				fontStyle: 'italic',
			},
			stroke: 'none',
			outline: 'none',
			resize: 'none',
			padding: '20px',
			borderRadius: '10px',
			width: '100%',
			boxSizing: 'border-box',
			":hover": {
				background: '#091342',
			},
			transition: 'all 0.2s',
		});

		return <input css={style} type="text" placeholder={placeholder} defaultValue={defaultValue} onInput={e => {
			this.onInput(e);
			if (onInput) onInput(e);
		}}></input>;
		// TODO: Make it purty, and also figure out sizing (flex? fixed? configurable from parent? etc.).
	}
}
