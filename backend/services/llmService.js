const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Service to interact with Google Gemini AI
 */
class LLMService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async analyzeEmotion(text) {
    const prompt = `
      Analyze the emotional content of this journal entry: "${text}"
      Return ONLY a JSON object: {"emotion": "word", "keywords": ["w1", "w2"], "summary": "sentence"}
    `;

    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      return this._parse(result.response.text());
    } catch (e) {
      try {
        const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        return this._parse(result.response.text());
      } catch (err) {
        return this._localAnalysis(text);
      }
    }
  }

  _parse(text) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Format error');
    return JSON.parse(match[0]);
  }

  _localAnalysis(text) {
    const input = text.toLowerCase();
    let emotion = "Neutral";
    let keywords = ["reflection", "nature"];
    
    if (input.includes("happy") || input.includes("joy") || input.includes("nice") || input.includes("good")) {
      emotion = "Happy";
      keywords.push("positivity");
    } else if (input.includes("calm") || input.includes("peace") || input.includes("quiet") || input.includes("rain")) {
      emotion = "Calm";
      keywords.push("serenity");
    } else if (input.includes("sad") || input.includes("bad") || input.includes("shit") || input.includes("angry")) {
      emotion = "Gloomy";
      keywords.push("disturbed");
    }

    const words = input.split(/\s+/).filter(w => w.length > 4).slice(0, 3);
    keywords = [...new Set([...keywords, ...words])];

    return {
      emotion,
      keywords,
      summary: `You seem to be feeling ${emotion.toLowerCase()} after your session.`
    };
  }
}

module.exports = new LLMService();
