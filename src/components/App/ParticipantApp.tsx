import * as React from "react";
import { Logger } from "../../data/logger";
import { store } from "../../store/store";
import LongTextBox from "../atoms/input/LongTextBox";
import RadioButton from "../atoms/input/RadioButton";
import ShortTextBox from "../atoms/input/ShortTextBox";
import { Slider } from "../atoms/input/Slider";
import { Button } from "../atoms/Button";
import { BackgroundImage } from "../atoms/image/BackgroundImage";
import { ImageCard } from "../atoms/image/ImageCard";
import { renderBoldText } from "../../utils/textUtils";

export default class ParticipantApp extends React.Component<{}> {
	private logger: Logger;

	constructor() {
		super({});
		this.logger = new Logger((entries, timesPerId) => {
			console.log(entries, timesPerId);
		}); // TODO: Write a storeData function that's probably just calling a thunk to send the data to a server, or saving to a cookie.
	}

	render() {
		return <div style={{background: 'black'}}>
			<BackgroundImage src="https://images.nightcafe.studio/jobs/24JEyUeOhCuirWEDRNil/24JEyUeOhCuirWEDRNil_4x.jpg?tr=w-1600,c-at_max"
							 blur="15px" overlayColor="linear-gradient(#1C262E, #050610)" overlayOpacity={0.8}/>
			<div style={{position: 'absolute', top: 0, left: 0, margin: '40px'}}>
				<ShortTextBox id="test-text-box" logger={this.logger} placeholder="Testing..."/>
				<Slider id="test-slider" logger={this.logger} leftLabel="low" rightLabel="high"/>
				<LongTextBox id="test-long-text" logger={this.logger} placeholder="Testing..."/>
				<RadioButton id="test-radio-button" logger={this.logger} label="Test"/>
				<Button text="yes"/>
				<p style={{width: '200px'}}>{renderBoldText("This is a *test* of how rendering *bold text* works! Let's see *if it can handle all this goodness, folks!* Right? *Right back at'cha.*")}</p>
				<br/><br/>
				<ImageCard src="https://cdnb.artstation.com/p/assets/images/images/051/898/687/large/luke-wells-luke-wells-landscape-midjourney.jpg"/>
			</div>
		</div>;
	}
}
