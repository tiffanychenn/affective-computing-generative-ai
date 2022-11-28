import * as React from 'react';
import { css } from '@emotion/react';
import { CSSInterpolation } from '@emotion/serialize';
import { OVERFLOW_SCROLL_STYLE } from '../../molecules/ButtonPanel';

interface Props {
	children: React.ReactNode;
	bgOpacity: number;
	flex: string;
	scroll: boolean; // If false, acts like a fixed absolute container
}

export class Panel extends React.Component<Props> {
	static defaultProps = {
		bgOpacity: 0.4,
		flex: 1,
		scroll: true,
	};

	render() {
		const { children, bgOpacity, flex, scroll } = this.props;

		const rootStyle: React.CSSProperties = {
			position: 'relative',
			width: '100%',
			height: '100%',
			flex: flex,
			backdropFilter: 'blur(14px)',
		};

		const containerStyle: React.CSSProperties = {
			width: '100%',
			height: '100%',
			position: 'absolute',
			top: 0, left: 0,
			background: `rgba(3, 6, 28, ${bgOpacity})`,
			borderRadius: '28px',
			// overflow: 'scroll',
		};

		// Brilliant solution by https://stackoverflow.com/a/66936639
		const pseudoStyle: React.CSSProperties = {
			position: 'absolute',
			inset: 0,
			borderRadius: '28px',
			padding: '2px',
			background: 'linear-gradient(to bottom, #0E1F7E, rgba(12, 26, 108, 0.12) 20%, rgba(10, 38, 137, 0.54) 80%, #051C9E)',
			mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
			WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
			maskComposite: 'exclude',
			WebkitMaskComposite: 'xor',
			pointerEvents: 'none',
		};

		const innerStyleParts: CSSInterpolation[] = [
			{
				boxSizing: 'border-box',
				padding: '60px',
				width: '100%',
				height: '100%',
			}
		];
		if (scroll) {
			innerStyleParts.push(OVERFLOW_SCROLL_STYLE);
		} else {
			innerStyleParts.push({
				overflow: 'visible',
			});
		}
		const innerStyle = css(innerStyleParts);

		const absoluteContentStyle: React.CSSProperties = {
			position: 'relative',
			width: '100%',
			height: '100%',
		}

		return <div style={rootStyle}>
			<div style={containerStyle}>
				<div css={innerStyle}>
					{scroll ?
						children :
						<div style={absoluteContentStyle}>
							{children}
						</div>
					}
				</div>
			</div>
			<div style={pseudoStyle}></div>
		</div>;
	}
}
