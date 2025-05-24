import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';          // ⬅ NEW style (default export)

const app = express();
app.use(express.json());
app.use(express.static('public'));

const openai = new OpenAI({           // ⬅ NEW ctor
  apiKey: process.env.OPENAI_API_KEY
});

function buildPrompt(obj){
  return `Patient has completed a detailed dizziness questionnaire…\\n`
       + JSON.stringify(obj, null, 2);
}

app.post('/api/chat', async (req, res) => {
  try {
    const prompt = buildPrompt(req.body.answers || {});

    const completion = await openai.chat.completions.create({   // ⬅ NEW call
      model: 'gpt-4o-mini',       // or gpt-4o/gpt-4o-mini, etc.
      messages: [
        { role: 'system', content: 'You are an experienced ENT clinician.' },
        { role: 'user',   content: prompt }
      ],
      temperature: 0.4
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OpenAI request failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('API server listening on', PORT));
