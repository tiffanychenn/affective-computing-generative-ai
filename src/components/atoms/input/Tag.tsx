import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { LoggedFormElementComponent, LoggedFormElementProps } from "./LoggedFormElement";

export interface Props extends LoggedFormElementProps {
	text?: string;
	onClick?: () => void;
    disabled?: boolean;
}

export class Tag extends LoggedFormElementComponent<Props> {
	render() {
		return <button type="button" className="tag" disabled={this.props.disabled} onClick={() => {
			this.onAnyEvent('click');
			if (this.props.onClick) {
				this.props.onClick();
			}
		}}>{this.props.text}</button>
	}
}
