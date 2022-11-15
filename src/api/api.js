const express = require("express");
const fs = require('fs');
const bodyParser = require('body-parser');

require('dotenv').config();

// Initialize the express engine
const app = express();
app.use(bodyParser.json());
 
// Take a port 5000 for running server.
const PORT = 5000;

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

app.post('/image-gen', async (req,res) => {
    try {
        const prompt = req.body.prompt;
        const image = await getDALLEImage(prompt);
        const experimentId = req.body.id;
        const sectionIndex = req.body.sectionIndex;
        const buffer = Buffer.from(image, "base64");
        const filename = experimentId + "-" + sectionIndex + ".png";
        fs.writeFile( "../../data/" + filename, buffer, (err) => {
            // In case of a error throw err.
            if (err) res.status(400).send("unable to save image");
        });

        const imageData = {
            filledPrompt: prompt,
            imageURL: filename,
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
    
        fs.writeFile("../../data/" + req.body.id + '.json', JSON.stringify(experimentData), (err) => {
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

// Update experiment data
app.post('/experiment', (req, res, next) => {
    const experimentData = {
        id: req.body.id,
        firstPlayerId: req.body.firstPlayerId,
        secondPlayerId: req.body.secondPlayerId,
        loggingData: req.body.loggingData,
        images: req.body.images
    }

    fs.writeFile("../../data/" + req.body.id + '.json', JSON.stringify(experimentData), (err) => {
        // In case of a error throw err.
        if (err) res.status(400).send("unable to save to file");
    })
    res.status(200).send({success: true});
});

app.listen(PORT, () => {
    console.log(
        `Server running on ${PORT}.`
    )
});

// extra functions that (sadly) have to be stored here because express doesn't work well with typescript 

// openai function
const { Configuration, OpenAIApi } = require("openai");
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