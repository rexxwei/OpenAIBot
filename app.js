const { Configuration, OpenAIApi } = require("openai");
const config = new Configuration({
  apiKey: "paste_API_Key_here",
});
const openai = new OpenAIApi(config);

const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
// Serve static files from the 'src' folder
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  // Replace 'index.html' with the path to your desired default HTML file
  res.sendFile(__dirname + "/index.html");
});

// API endpoint to handle user requests
app.post("/get_openai_response", async (req, res) => {
  try {
    const userMessage = req.body.userMessage;
    console.log("userMessage is " + userMessage + "!!");
    // Make the API call to OpenAI
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      // model: "gpt-3.5-turbo-instruct",
      prompt: userMessage,
      max_tokens: 128,
      temperature: 1,
    });
    const resp = response.data.choices[0].text;
    console.log(resp);
    const botRes = resp.trimStart();
    // botRes = "\n\nStill in testing.";

    res.json({ botRes });
  } catch (error) {
    console.error("Error fetching bot response:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
