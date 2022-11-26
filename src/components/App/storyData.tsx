import { ImageStep, ReflectStep, StorySection, StoryStepType, TitleStep, WritePromptStep, InfoStep, CustomFormStep, RoleSelectStep, ControlSet } from '../../data/story';
import ShortTextBox from '../atoms/input/ShortTextBox';
import { Slider } from '../atoms/input/Slider';
import { PageHeader, Text } from '../atoms/text/Text';

export const PLACEHOLDER_IMG_URL = 'https://cdnb.artstation.com/p/assets/images/images/051/898/687/large/luke-wells-luke-wells-landscape-midjourney.jpg';
export const STAR_BG = './assets/stars_bg_16.png';
export const PLAIN_BG = '#0B0B25';
export const PLANET_ARRIVAL_IMG = './assets/arrival.png';
export const WAND_IMG = './assets/wand.png';
export const PLANET_DEPARTURE_IMAGE = './assets/departure.png';
// FIXME: It seems like when we use low-res images, flexbox throws a hissy fit and decides to keep things small. We might need to use viewport sizing instead.

export const GAME_NAME = "Collaborative Game Study";

const ONE_SECOND_MS = 1000;

export const EXPERIMENTAL_STORY_DATA: Array<StorySection> = [
	{
		steps: [
			{
				type: StoryStepType.Title,
				id: 'title',
			} as TitleStep,
			{
				type: StoryStepType.Info,
				id: 'intro',
				backgroundImage: STAR_BG,
				title: "Welcome to " + GAME_NAME,
				instructions: "Today, you embark on a creative journey together. To play the game, you'll need to answer a few questions about yourself. There are no wrong answers, so try not to overthink it.\n\nThis game uses images to help move your conversation along. They might be weird, but just go with it.",
			} as InfoStep,
			{
				type: StoryStepType.Info,
				id: 'choose-player-number',
				backgroundImage: STAR_BG,
				title: 'Choose your character',
				instructions: "You've each been assigned to be either player 1 or player 2 (written below your participant ID). Follow the instructions to take turns reading the instructions out loud.\n\nConversation is encouraged! Feel free to discuss as feels natural.",
			} as InfoStep,
			{
				type: StoryStepType.Info,
				id: 'scenario-1',
				backgroundImage: STAR_BG,
				cardImage: PLANET_ARRIVAL_IMG,
				player: 1,
				playerAction: "Read out loud",
				title: 'Imagine:',
				instructions: 'Researchers at the MIT Media Lab have invented teleportation! The two of you sign up for a study right away. During the study, something goes wrong, and the two of you get stranded on a distant but seemingly habitable planet.',
			} as InfoStep,
			{
				type: StoryStepType.Info,
				id: 'scenario-2',
				backgroundImage: STAR_BG,
				cardImage: WAND_IMG,
				player: 2,
				playerAction: "Read out loud",
				instructions: "While wandering the strange planet, you're delighted to discover a magic wand that can create anything in your imagination.\n\nAfter taking care of basic necessities, you're struck with inspiration: you can use this wand to create the world of your dreams!\n\nTogether, you decide to stay a while, and create a dream place for you both to live.",
			} as InfoStep,
			{
				type: StoryStepType.RoleSelect,
				id: 'role-select',
				tags: ["peaceful", "fun", "adventurous", "epic", "safe", "creative", "weird"],
			} as RoleSelectStep,
			{
				type: StoryStepType.Info,
				id: 'role-explanation',
				backgroundImage: STAR_BG,
				player: 'buildings',
				playerAction: "Read out loud",
				instructions: "To collaborate effectively, you decide to break up the tasks into what each person is most interested in.\n\nYou decide that {other} will start with the landscape, and {curr} will start with the buildings."
				// NOTE: If you change "player" above, be sure to change {other} and {curr} above!
			} as InfoStep,
		],
	},

	{
		genPrompt: "landscape with {landscape-prompt-blank}",
		steps: [
			{
				type: StoryStepType.WritePrompt,
				triggersGenerate: true,
				id: 'landscape-prompt',
				player: 'landscape',
				playerAction: 'Take the lead',
				title: "Describe the landscape:",
				instructions: "What kind of nature do you enjoy most on Earth? Are there mountains, lakes, or rivers? Think about the plants and colors that bring you joy.\n\nWith this in mind, *paint a picture of the terrain and texture of the landscape.*",
				hint: "Feel free to discuss your choices as a pair.",
				exampleText: "e.g., big pink puffy trees near lots of rivers",
				backgroundImage: STAR_BG,
				cardImage: PLANET_ARRIVAL_IMG,
				timeLimitMs: 1.5 * 60 * ONE_SECOND_MS,
				wordLimit: 15,
				// TODO: Choose time and word/character limits.
			} as WritePromptStep,
			{
				type: StoryStepType.Reflect,
				id: 'landscape-reflect',
				player: 'landscape',
				question: "{Curr}, recall an especially interesting time you've been in nature. What made it so special?",
				backgroundImage: STAR_BG,
				cardImage: PLANET_ARRIVAL_IMG,
			} as ReflectStep,
			{
				type: StoryStepType.Image,
				id: 'landscape-display',
				cardImage: 1,
				backgroundImage: 1,
				redoReturnsToStepIndex: 0,
				blurBG: true,
				overlayBG: false,
			} as ImageStep,
		],
	},

	{
		genPrompt: "{represented-slider}",
		promptTransformers: {
			'represented-slider': value => value < 50 ? '!redo1' : '!keep1t',
		},
		steps: [
			{
				type: StoryStepType.CustomForm,
				triggersGenerate: true,
				id: 'represented-test',
				player: 'both',
				playerAction: 'Discuss the following',
				cardImage: 1,
				backgroundImage: 1,
				blurBG: true,
				requiredFormElemIds: ['represented-slider'],
				maxWidthIfNoImageCard: false,
				makeContent: (logger, hasTimedOut, renderText) => <>
					<PageHeader>Reflect</PageHeader>
					<Text>{renderText("TEST: Look around at the world you have created together. *Do you feel personally represented by this space you have co-created? Why or why not?*")}</Text>
					<Slider id="represented-slider"
							logger={logger}
							leftLabel="Not at all"
							rightLabel="Super accurate"/>
				</>,
				timeLimitMs: 1.5 * 60 * ONE_SECOND_MS,
			} as CustomFormStep,
			{
				type: StoryStepType.Reflect,
				id: 'represented-test-reflect',
				player: 'both',
				playerAction: 'Discuss the following',
				question: "TODO if relevant",
				backgroundImage: 1,
				cardImage: 1,
				blurBG: true,
			} as ReflectStep,
			{
				type: StoryStepType.Image,
				id: 'represented-test-display',
				cardImage: 2,
				backgroundImage: 2,
				redoReturnsToStepIndex: 0,
				blurBG: true,
				overlayBG: false,
			} as ImageStep,
		],
	},

	{
		genPrompt: "landscape with {landscape-prompt-blank}, buildings that look like {buildings-prompt-blank}",
		steps: [
			{
				type: StoryStepType.WritePrompt,
				triggersGenerate: true,
				id: 'buildings-prompt',
				player: 'buildings',
				playerAction: "It's your turn now",
				title: "Design some buildings:",
				instructions: "What kinds of spaces make you feel most at home? Is it big city buildings, or cozy rustic cabins? Consider the kinds of things that you like to do.\n\nWith this in mind, briefly *describe a building or set of buildings.*",
				exampleText: "e.g., treehouses with lush gardens",
				backgroundImage: 1,
				cardImage: 1,
				blurBG: true,
				overlayBG: true,
				timeLimitMs: 1.5 * 60 * ONE_SECOND_MS,
				wordLimit: 15,
				// TODO: Choose time and word/character limits.
			} as WritePromptStep,
			{
				type: StoryStepType.Reflect,
				id: 'buildings-reflect',
				player: 'buildings',
				question: "{Curr}, in what kind of spaces do you most feel like your authentic self? How might the building you made let you access that?",
				backgroundImage: 1,
				cardImage: 1,
				blurBG: true,
				overlayBG: true,
			} as ReflectStep,
			{
				type: StoryStepType.Image,
				id: 'buildings-display',
				cardImage: 2,
				backgroundImage: 2,
				redoReturnsToStepIndex: 0,
				blurBG: true,
				overlayBG: false,
			} as ImageStep,
		],
	},

	{
		genPrompt: "landscape with {landscape-prompt-blank}, buildings that look like {buildings-prompt-blank}, in the background {miss-prompt-blank}",
		steps: [
			{
				type: StoryStepType.WritePrompt,
				triggersGenerate: true,
				id: 'miss-prompt',
				player: 'buildings',
				playerAction: "It's your turn now",
				title: "Add some meaning:",
				instructions: "It's important to you to make this a nice place for your partner to live as well. Think about what parts of life they think are most precious.\n\nWhat would your partner miss most from back home? Add some object to the world that would make them feel more at home.",
				exampleText: "e.g., science fiction library",
				backgroundImage: 2,
				cardImage: 2,
				blurBG: true,
				timeLimitMs: 1.5 * 60 * ONE_SECOND_MS,
				wordLimit: 15,
				// TODO: Choose time and word/character limits.
			} as WritePromptStep,
			{
				type: StoryStepType.Reflect,
				id: 'miss-reflect',
				player: 'buildings',
				question: "{Other}, is this a meaningful gift? In general, what is the best way for your friends to show that they care?",
				backgroundImage: 2,
				cardImage: 2,
				blurBG: true,
			} as ReflectStep,
			{
				type: StoryStepType.Image,
				id: 'miss-display',
				cardImage: 3,
				backgroundImage: 3,
				redoReturnsToStepIndex: 0,
				blurBG: true,
				overlayBG: false,
			} as ImageStep,
		],
	},

	{
		genPrompt: "landscape with {landscape-prompt-blank}, buildings that look like {buildings-prompt-blank}, in the background {miss-prompt-blank}, in the foreground {gift-prompt-blank}",
		steps: [
			{
				type: StoryStepType.WritePrompt,
				triggersGenerate: true,
				id: 'gift-prompt',
				player: 'landscape',
				playerAction: "It's your turn now",
				title: "Give a gift:",
				instructions: "You're touched by your partner's gesture, and want to give them something in return.\n\nWhat is something positive about your partner? How could you build something here that honors them? Describe some object which represents this positive aspect of your partner.",
				exampleText: "e.g., creative workshop",
				backgroundImage: 3,
				cardImage: 3,
				blurBG: true,
				timeLimitMs: 1.5 * 60 * ONE_SECOND_MS,
				wordLimit: 15,
				// TODO: Choose time and word/character limits.
			} as WritePromptStep,
			{
				type: StoryStepType.Reflect,
				id: 'gift-reflect',
				player: 'landscape',
				question: "{Other}, how do you feel being labeled with these positive qualities? Are there other hidden parts of you that you wish others would also see?",
				backgroundImage: 3,
				cardImage: 3,
				blurBG: true,
			} as ReflectStep,
			{
				type: StoryStepType.Image,
				id: 'gift-display',
				cardImage: 4,
				backgroundImage: 4,
				redoReturnsToStepIndex: 0,
				blurBG: true,
				overlayBG: false,
			} as ImageStep,
		],
	},

	// TODO: Possible 5th question?

	{
		genPrompt: "{represented-slider}",
		promptTransformers: {
			'represented-slider': value => value < 50 ? '!redo4' : '!keep4t',
		},
		steps: [
			{
				type: StoryStepType.CustomForm,
				triggersGenerate: true,
				id: 'represented',
				player: 'both',
				playerAction: 'Discuss the following',
				cardImage: 4, // FIXME: Change this to whichever section is last.
				backgroundImage: 4,
				blurBG: true,
				requiredFormElemIds: ['represented-slider'],
				maxWidthIfNoImageCard: false,
				makeContent: (logger, hasTimedOut, renderText) => <>
					<PageHeader>Reflect</PageHeader>
					<Text>{renderText("Look around at the world you have created together. *Do you feel personally represented by this space you have co-created? Why or why not?*")}</Text>
					<Slider id="represented-slider"
							logger={logger}
							leftLabel="Not at all"
							rightLabel="Super accurate"/>
				</>,
				timeLimitMs: 1.5 * 60 * ONE_SECOND_MS,
			} as CustomFormStep,
			// {
			// 	type: StoryStepType.CustomForm,
			// 	id: 'life-values',
			// 	player: 'both',
			// 	playerAction: "Discuss the following",
			// 	cardImage: 4,
			// 	backgroundImage: 4,
			// 	blurBG: true,
			// 	requiredFormElemIds: ['life-value-1', 'life-value-2', 'life-value-3'],
			// 	makeContent: (logger, hasTimedOut, renderText) => <>
			// 		<PageHeader>Reflect</PageHeader>
			// 		<Text>{renderText("Based on how you have both answered the questions, what are 3 things you both seem to value most in life?")}</Text>
			// 		{/* TODO: I've currently left these without placeholder text, because I
			// 		think it'll be more interesting to see what people write organically. We
			// 		can change that, though! */}
			// 		<ShortTextBox id="life-value-1" logger={logger}/>
			// 		<ShortTextBox id="life-value-2" logger={logger}/>
			// 		<ShortTextBox id="life-value-3" logger={logger}/>
			// 	</>,
			// 	timeLimitMs: 1.5 * 60 * ONE_SECOND_MS,
			// } as CustomFormStep,
			{
				type: StoryStepType.Reflect,
				id: 'represented-reflect',
				player: 'both',
				playerAction: 'Discuss the following',
				question: "TODO if relevant",
				backgroundImage: 4,
				cardImage: 4,
				blurBG: true,
			} as ReflectStep,
			{
				type: StoryStepType.Image,
				id: 'represented-display',
				cardImage: 5,
				backgroundImage: 5,
				redoReturnsToStepIndex: 0,
				blurBG: true,
				overlayBG: false,
			} as ImageStep,
		],
	},
	
	{
		steps: [
			{
				type: StoryStepType.Info,
				id: 'ending',
				player: 'both',
				playerAction: 'Read the following',
				cardImage: 5,
				backgroundImage: 5,
				blurBG: true,
				instructions: "Suddenly, a teleportation machine appears in front of you. Booming out from a speaker onboard, you hear the voices of the researchers: \"It's time to come back to the Media Lab!\"\n\nBoth of you walk into the machine, take one last look at the world you made, and return home.\n\nThe end.",
				hideNext: true,
			} as InfoStep,
		],
	},
];

export const CONTROL_STORY_DATA: Array<StorySection> = [
	{
		steps: [
			{
				type: StoryStepType.Title,
				id: 'title',
			} as TitleStep,
			{
				type: StoryStepType.Info,
				id: 'intro',
				backgroundImage: PLAIN_BG,
				title: "Welcome to " + GAME_NAME,
				instructions: "This activity is about interpersonal closeness. Your task, which we think will be quite enjoyable, is simply to get close to your partner, with whom you've been matched.\n\nIn alternating order, take turns reading questions that appear on screen. Read it *out loud*, carry out the activity, then move on when you are ready.",
			} as InfoStep,
		],
	},
	{
		steps: [
			{
				type: StoryStepType.Info,
				id: 'fast-friends-set-1-question-1-player-1',
				player: 1,
				playerAction: "It's your turn now",
				title: "Answer this question:",
				instructions: "Given the choice of anyone in the world, whom would you want as a dinner guest?",
				backgroundImage: PLAIN_BG,
			} as InfoStep,
			{
				type: StoryStepType.Info,
				id: 'fast-friends-set-1-question-1-player-2',
				player: 2,
				playerAction: "It's your turn now",
				title: "Answer this question:",
				instructions: "Given the choice of anyone in the world, whom would you want as a dinner guest?",
				backgroundImage: PLAIN_BG,
			} as InfoStep,
		],
	},
	{
		steps: [
			{
				type: StoryStepType.Info,
				id: 'fast-friends-set-1-question-2-player-2',
				player: 1,
				playerAction: "It's your turn now",
				backgroundImage: PLAIN_BG,
				title: "Answer this question:",
				instructions: "If you could wake up tomorrow having gained any one quality or ability, what would it be?",
			} as InfoStep,
			{
				type: StoryStepType.Info,
				id: 'fast-friends-set-1-question-2-player-1',
				player: 2,
				playerAction: "It's your turn now",
				backgroundImage: PLAIN_BG,
				title: "Answer this question:",
				instructions: "If you could wake up tomorrow having gained any one quality or ability, what would it be?",
			} as InfoStep,
		],
	},
	{
		steps: [
			{
				type: StoryStepType.Info,
				id: 'fast-friends-set-2-question-3-player-2',
				player: 1,
				playerAction: "It's your turn now",
				backgroundImage: PLAIN_BG,
				title: "Answer this question:",
				instructions: "If a crystal ball could tell you the truth about yourself, your life, the future, or anything else, what would you want to know?",
			} as InfoStep,
			{
				type: StoryStepType.Info,
				id: 'fast-friends-set-2-question-3-player-1',
				player: 2,
				playerAction: "It's your turn now",
				backgroundImage: PLAIN_BG,
				title: "Answer this question:",
				instructions: "If a crystal ball could tell you the truth about yourself, your life, the future, or anything else, what would you want to know?",
			} as InfoStep,
		],
	},
	{
		steps: [
			{
				type: StoryStepType.Info,
				id: 'fast-friends-set-2-question-4-player-1',
				player: 1,
				playerAction: "It's your turn now",
				backgroundImage: PLAIN_BG,
				title: "Answer this question:",
				instructions: "How close and warm is your family? Do you feel your childhood was happier than most other people's?",
			} as InfoStep,
			{
				type: StoryStepType.Info,
				id: 'fast-friends-set-2-question-4-player-2',
				player: 2,
				playerAction: "It's your turn now",
				backgroundImage: PLAIN_BG,
				title: "Answer this question:",
				instructions: "How close and warm is your family? Do you feel your childhood was happier than most other people's?",
			} as InfoStep,
		],
	},
	{
		steps: [
			{
				type: StoryStepType.Info,
				id: 'fast-friends-set-3-question-5-player-1',
				player: 1,
				playerAction: "It's your turn now",
				backgroundImage: PLAIN_BG,
				title: "Answer this question:",
				instructions: "If you were going to become a close friend with your partner, what would be important for them to know?",
			} as InfoStep,
			{
				type: StoryStepType.Info,
				id: 'fast-friends-set-3-question-5-player-2',
				player: 2,
				playerAction: "It's your turn now",
				backgroundImage: PLAIN_BG,
				title: "Answer this question:",
				instructions: "If you were going to become a close friend with your partner, what would be important for them to know?",
			} as InfoStep,
		],
	},
	{
		steps: [
			{
				type: StoryStepType.Info,
				id: 'fast-friends-set-3-question-6-player-2',
				player: 1,
				playerAction: "It's your turn now",
				backgroundImage: PLAIN_BG,
				title: "Answer this question:",
				instructions: "If you were to die this evening with no opportunity to communicate with anyone, what would you most regret not having told someone? Why haven't you told them yet?",
			} as InfoStep,
			{
				type: StoryStepType.Info,
				id: 'fast-friends-set-3-question-6-player-1',
				player: 2,
				playerAction: "It's your turn now",
				backgroundImage: PLAIN_BG,
				title: "Answer this question:",
				instructions: "If you were to die this evening with no opportunity to communicate with anyone, what would you most regret not having told someone? Why haven't you told them yet?",
			} as InfoStep,
		],
	},
	{
		steps: [
			{
				type: StoryStepType.Info,
				id: 'ending',
				player: 'both',
				playerAction: 'Read the following',
				backgroundImage: STAR_BG,
				cardImage: PLANET_ARRIVAL_IMG,
				blurBG: true,
				instructions: "Thank you for sharing and playing the game!\n\nThe end.",
				hideNext: true,
			} as InfoStep,
		],
	},
];

export const FAST_FRIENDS_DATA: Array<ControlSet> = [
	{
		timeoutMs: 6 * 60 * ONE_SECOND_MS,
		questions: [
			"Given the choice of anyone in the world, whom would you want as a dinner guest?",
			"Would you like to be famous? In what way?",
			"Before making a telephone call, do you ever rehearse what you are going to say? Why?",
			"What would constitute a \"perfect\" day for you?",
			"When did you last sing to yourself? To someone else?",
			"If you were able to live to the age of 90 and retain either the mind or body of a 30-year-old for the last 60 years of your life, which would you want?",
			"Do you have a secret hunch about how you will die?",
			"Name three things you and your partner appear to have in common.",
			"For what in your life do you feel most grateful?",
			"If you could change anything about the way you were raised, what would it be?",
			"Take a minute to tell your partner your life story in as much detail as possible.",
			"If you could wake up tomorrow having gained any one quality or ability, what would it be?",
		],
	},

	{
		timeoutMs: 6 * 60 * ONE_SECOND_MS,
		questions: [
			"If a crystal ball could tell you the truth about yourself, your life, or anything else, what would you want to know?",
			"Is there something that you've dreamed of doing for a long time? Why haven't you done it?",
			"What is the greatest accomplishment of your life?",
			"What do you value most in a friendship?",
			"What is your most treasured memory?",
			"What is your most terrible memory?",
			"If you knew that in one year you would die suddenly, would you change anything about the way you are now living? Why?",
			"What does friendship mean to you?",
			"What roles do love and affection play in your life?",
			"Alternate sharing something you consider a positive characteristic of your partner. Share a total of 5 items.",
			"How close and warm is your family? Do you feel your childhood was happier than most other people's?",
			"How do you feel about your relationship with your mother?",
		],
	},

	{
		timeoutMs: 6 * 60 * ONE_SECOND_MS,
		questions: [
			"Make 3 true \"we\" statements. For instance, \"We are both in this room feeling...\"",
			"Complete this sentence: \"I wish I had someone with whom I could share...\"",
			"If you were going to become a close friend with your partner, please share what would be important for him or her to know.",
			"Tell your partner what you like about them; be very honest this time saying things that you might not say to someone you've just met.",
			"Share with your partner an embarrassing moment in your life.",
			"When did you last cry in front of another person? By yourself?",
			"Tell your partner something that you like about them already.",
			"What, if anything, is too serious to be joked about?",
			"If you were to die this evening with no opportunity to communicate with anyone, what would you most regret not having told someone? Why haven't you told them yet?",
			"Your house, containing everything you own, catches fire. After saving your loved ones and pets, you have time to safely make a final dash to save any one item. What would it be? Why?",
			"Of all the people in your family, whose death would you find most disturbing? Why?",
			"Share a personal problem and ask your partner's advice on how he or she might handle it. Also, ask your partner to reflect back to you how you seem to be feeling about the problem you have chosen.",
		],
	},
];
