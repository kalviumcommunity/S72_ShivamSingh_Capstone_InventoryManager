const axios = require('axios');

const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev";
const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

exports.generateImage = async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await axios.post(
      HUGGINGFACE_API_URL,
      { inputs: prompt, options: { wait_for_model: true } },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
        },
        responseType: 'arraybuffer', // for image bytes
      }
    );
    // Convert image bytes to base64
    const base64Image = `data:image/png;base64,${Buffer.from(response.data).toString('base64')}`;
    res.json({ image: base64Image });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate image' });
  }
}; 