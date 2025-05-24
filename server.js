import 'dotenv/config';
import express from 'express';
import { Configuration, OpenAIApi } from 'openai';

const app  = express();
app.use(express.json());
app.use(express.static('public'));

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

function buildPrompt(obj){
  return `Patient has completed a detailed dizziness questionnaire. Below are their raw answers as JSON.

Return:

1. A ranked list of 5 most likely diagnoses (differential) with 1‑sentence justifications.
2. Initial management options for primary‑care or ENT to consider (bullet list).
3. Any red‑flag features that warrant urgent referral.

Answers:\n` + JSON.stringify(obj, null, 2);
}

app.post('/api/chat', async (req, res) => {
  try{
    const prompt = buildPrompt(req.body.answers || {});
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        { role:'system', content:'You are an experienced ENT clinician.' },
        { role:'user',   content: prompt }
      ],
      temperature: 0.4
    });

    res.json({ reply: completion.data.choices[0].message.content });
  }catch(err){
    console.error(err);
    res.status(500).json({ error:'OpenAI request failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log('API server listening on '+PORT));
