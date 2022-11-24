const uuid = require("uuid")
const express = require("express");
const fs = require('fs');
const path = require("path");
const { Configuration, OpenAIApi } = require("openai");
const { dir } = require("console");
const bodyParser = require('body-parser');

require('dotenv').config();

// Initialize the express engine
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
// Take a port 5000 for running server.
const PORT = 4000;

/* loggingData: {
 *   entries: { [timeSinceEpoch: number]: { [formElemId: string]: any } },
 *   timesPerId: { [formElemId: string]: Array<number> },
 * }
 */
// images: { [sectionIndex: number]: { filledPrompt: string, path: string } }

app.get('/',(req,res) => {
    res.status(200).json({
        'message': 'Running Node with Express and Typescript'
    });
});

app.use('/client', express.static(path.join(__dirname, '../../dist/')));
app.use('/client/assets', express.static(path.join(__dirname, '../../assets/')));
app.use('/client/data', express.static(path.join(__dirname, '../../data/')));

app.post('/image-gen', async (req,res) => {
    try {
        const prompt = req.body.prompt;
        const image = await getDALLEImage(prompt);
        const experimentId = req.body.id;
        const sectionIndex = req.body.sectionIndex;
        const buffer = Buffer.from(image, "base64");
        const filename = experimentId + "-" + sectionIndex + "-" + req.body.hasUsedRedo + ".png";
        const filepath = "../../data/" + experimentId + "/";
        fs.writeFile(filepath + filename, buffer, (err) => {
            // In case of a error throw err.
            if (err) res.status(400).send("unable to save image");
        });

        const imageData = {
            filledPrompt: prompt,
            imageURL: experimentId + "/" + filename,
        };

        const newImages = Object.assign({}, req.body.images);
        newImages[sectionIndex] = imageData;

        const experimentData = {
            id: experimentId,
            firstPlayerId: req.body.firstPlayerId,
            secondPlayerId: req.body.secondPlayerId,
            loggingData: req.body.loggingData,
            images: newImages,
        }
    
        fs.writeFile(filepath + experimentId + '.json', JSON.stringify(experimentData), (err) => {
            // In case of a error throw err.
            if (err) res.status(400).send("unable to save to file");
        })

        res.status(200).json(
            imageData
        );
    }
    catch {
        res.status(200).json(
            {error: "could not get image"}
        );
    }
});

function getExperimentData(body) {
    const experimentData = {
        id: body.id,
        firstPlayerId: body.firstPlayerId,
        secondPlayerId: body.secondPlayerId,
        loggingData: body.loggingData,
        images: body.images,
        sectionIndex: body.sectionIndex,
        stepIndex: body.stepIndex,
        experimentType: body.experimentType,
    };
    return experimentData;
}

app.post('/startExperiment', (req, res, next) => {
    // See if the current experiment ID already exists
    const experimentData = getExperimentData(req.body);
    const filepath = "../../data/" + experimentData.id;
    const jsonFile = filepath + "/" + experimentData.id + '.json';
    if (!experimentData.id) {
        res.status(400).send("No experiment ID was supplied.");
        return;
    }
    
    if (fs.existsSync(filepath)) {
        // Experiment already exists
        if (!fs.existsSync(jsonFile)) {
            res.status(400).send("JSON for existing experiment does not exist.");
            return;
        }
        const savedExperimentData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
        if ((savedExperimentData.firstPlayerId !== experimentData.firstPlayerId) || (savedExperimentData.secondPlayerId !== experimentData.secondPlayerId)) {
            res.status(400).send("Player ID(s) do not match the saved ones for existing experiment.");
            return;
        }
        res.status(200).send({
            isExistingExperiment: true,
            experimentData: savedExperimentData
        });

    }
    else {
        fs.mkdirSync(filepath);
        fs.writeFile(jsonFile, JSON.stringify(experimentData), (err) => {
            // In case of a error throw err.
            if (err) {
                res.status(400).send("unable to save to file");
                return;
            }
        })
        res.status(200).send({
            isExistingExperiment: false,
            experimentData: experimentData
        });
    }
    // If it does, make sure the players are correct; otherwise, throw
    // If it does, and the players are correct, then send back the previous state and make sure it gets loaded in in the client -> make it possible to initialize state with API response in client
    // Otherwise, send back a happy handshake
});

// Update experiment data
app.post('/experiment', (req, res, next) => {
    const experimentData = getExperimentData(req.body);
    const hasDataFolder = fs.existsSync("../../data");
    if (!hasDataFolder) {
        fs.mkdirSync("../../data");
    }
    const hasExperimentFolder = fs.existsSync("../../data/" + req.body.id);
    if (!hasExperimentFolder) {
        res.status(400).send("experiment id doesn't exist");
        return;
    }

    fs.writeFile("../../data/" + req.body.id + "/" + req.body.id + '.json', JSON.stringify(experimentData), (err) => {
        // In case of a error throw err.
        if (err) {
            res.status(400).send("unable to save to file");
            return;
        }
    })
    res.status(200).send("success");
});

app.listen(PORT, () => {
    console.log(
        `Server running on ${PORT}.`
    );
});

// extra functions that (sadly) have to be stored here because express doesn't work well with typescript 

// openai function
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

async function getDALLEImage(prompt) {
	const response = await openai.createImage({
        prompt: textSoaper(prompt),
        n: 1,
        size: "1024x1024",
        response_format: "b64_json"
    });
    const b64_json = response.data.data[0].b64_json;
    return b64_json;
}

// text soaper
const CONJUNCTIONS = ["and", "plus"];

function textSoaper(text) {
    let new_text = text;
    for (let i = 0; i < CONJUNCTIONS.length; i ++) {
        new_text = new_text.replace(CONJUNCTIONS[i], "");
    }
    return new_text.replace(/[.,?!\";:-]/, " ").replace(/\s\s+/, " ");
}