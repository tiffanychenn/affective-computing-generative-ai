export interface StorySection {
	steps: Array<StoryStep>;
	genPrompt?: string; // Formatted like "this is some text with {0} and refers to the result from prompt {1} and so on"
	promptTransformers?: { [formElemId: string]: (value: any) => string }; // Used to convert blank values into strings, e.g., choosing a word for a slider.
}

export enum StoryStepType {
	Info = 'info', // often for storyline, just reading written text
	WritePrompt = 'writeprompt',
	Reflect = 'reflect',
	Image = 'image', // possibly image selection
	Title = 'title', // title slide, should also probably put experiment generation code here
}

export interface StoryStep {
	type: StoryStepType;
	id: string;
	
	// If an image is a string, then it should point to a source.
	// If an image is a number, that points to the index of the step
	// whose resulting image we want to display.
	backgroundImage?: string | number; // If undefined, a linear gradient is used instead.
	cardImage?: string | number; // If undefined, no card is shown.
	blurBG?: boolean; // Whether to blur the background image.
	overlayBG?: boolean; // Whether to overlay the background image with a translucent color layer.

	timeLimitMs?: number; // If undefined, no time limit will appear.
}

/* Types of steps, and what data they need.
 * 
 * Almost everything has a question or a title. But it gets displayed so differently. Hm.
 * WritePrompt: The prompt string up to this point, with placeholder indices. The title or
 *   question, of course, that prompts it. A time limit, maybe, unless that's universal
 *   across these. Which player(s) should be speaking. Possibly a BG image.
 * Reflect: A title/question. That's really all. Also, which player(s) should speak. Possibly a BG image, probably not though.
 * Image: Just show the image. Possibly ask a question about the image? But probably not.
 * Info: This one's tough because of potential visual differences between these slides. Unsure.
 */

// In any info text, {curr} will always be replaced with the current player (e.g., "player 1"),
// and {other} will always be replaced with the other player (e.g., "player 2"). If the first
// character should be capitlized (i.e., "Player 1" instead of "player 1"), please capitalize
// the first letter of the placeholder (i.e., {Curr} instead of {curr}).

// Anything that isn't a title can also handle bolding in the form of *s. If you write *hello*
// in instructions, for example, it will be rendered as <strong>hello<strong>.

export interface IAllowsRedo {
	// If undefined, redo is disallowed. Otherwise, specifies the index of the
	// StoryStep within this StorySection to which users should be sent back to
	// perform their redo.
	redoReturnsToStepIndex?: number;
}

export interface WritePromptStep extends StoryStep {
	type: typeof StoryStepType.WritePrompt;
	player: 'landscape' | 'buildings' | 'both';
	playerAction: string;
	title: string;
	instructions: string;
	hint?: string;
	exampleText: string;

	wordLimit?: number;
	charLimit?: number;
}

export interface ReflectStep extends StoryStep {
	type: typeof StoryStepType.Reflect;
	player: 'landscape' | 'buildings' | 'both';
	question: string;
	cardImage: string | number;
}

export interface ImageStep extends StoryStep, IAllowsRedo {
	type: typeof StoryStepType.Image;
	cardImage: string | number;
}

export interface TitleStep extends StoryStep {
	type: typeof StoryStepType.Title;
}

export interface InfoStep extends StoryStep {
	type: typeof StoryStepType.Info;
	title?: string;
	instructions: string;
	player?: 1 | 2 | 'landscape' | 'buildings' | 'both',
	playerAction?: string;
	hint?: string;
}
