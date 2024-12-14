import { Hono } from 'hono'
import { instrument } from '@fiberplane/hono-otel';
import Home from './page';

type Bindings = {
  DATABASE_URL: string;
  OPENAI_API_KEY: string;
  AI: Ai,
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
  return c.html(<Home/>);
});

app.get('/api/topic', async (c) => {
  const { baseTopic, skip } = c.req.query();

  const messageResponse = await c.env.AI.run("@cf/meta/llama-3.1-70b-instruct" as any, {
    messages: [
      {
        role: "system",
        content: `
          Your task is to generate a topic for a pictionary game. You will be given a base topic by the user.
          Generate a topic. Your response should only be the topic, and preferably be a single word or two.
          You'll also given skip topics, skip these topics.
        `
      }, {
        role: "user",
        content: "Topic: " + (baseTopic ?? "") + "Skip: " + (skip ?? ""),
      }
    ],
    temperature: 1,
  }) as { response: string };

  return c.text(messageResponse.response);
});

app.get('/api/image', async (c) => {
  const { topic } = c.req.query();

  const messageResponse = await c.env.AI.run("@cf/meta/llama-3.1-70b-instruct" as any, {
    messages: [
      {
        role: "system",
        content: `
          Your task is to generate a description of a pictionary drawing for the user provided topic.
          Describe a whiteboard drawing. Also somehow include a goose in the drawing, either replacing
          a character with a goose, or adding a random goose.
          Make sure to mention that there should be no text in the drawing.
        `
      }, {
        role: "user",
        content: topic ?? "",
      }
    ],
    temperature: 1,
  }) as { response: string };

  // https://dev.to/fiberplane/building-honcanator-the-ai-goose-generator-43gn
  const model = '@cf/black-forest-labs/flux-1-schnell' as BaseAiTextToImageModels;
  const prompt = messageResponse.response;
  const response = await c.env.AI.run(model, {
    prompt: 'A whiteboard drawing with no text. It does not contain any text. ' + prompt,
  });

  // Type issues
  const base64image = (response as any).image;
  return c.body(base64image as any);
});

export default instrument(app);
