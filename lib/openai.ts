/* eslint-disable no-var */
import OpenAI from 'openai';

declare global {
  var openai: OpenAI | undefined;
}

const openai =
  global.openai ||
  new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'],
    organization: process.env['OPENAI_API_ORG'],
  });

if (process.env.NODE_ENV !== 'production') global.openai = openai;

export default openai;
