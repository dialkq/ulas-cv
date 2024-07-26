import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai-edge';
import formidable, { File } from 'formidable';
import fs from 'fs';
import util from 'util';

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

// Disable bodyParser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to parse the form
const parseForm = (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const form = formidable({ multiples: false, uploadDir: '/tmp' });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { files } = await parseForm(req);
    const file = files.file as File | File[];

    if (!file || Array.isArray(file)) {
      return res.status(400).json({ error: 'No file uploaded or multiple files uploaded' });
    }

    const filePath = file.filepath;
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    try {
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Review the following CV and provide suggestions for improvement:\n\n${fileContent}`,
        max_tokens: 500,
      });

      const data = await response.json(); // Parse JSON response

      fs.unlinkSync(filePath); // Delete the file after reading its content

      // Ensure the response contains the expected data structure
      if (data && data.choices && data.choices[0]) {
        res.status(200).json({ review: data.choices[0].text });
      } else {
        res.status(500).json({ error: 'Unexpected response structure from OpenAI' });
      }
    } catch (error) {
      console.error('Error processing CV with OpenAI:', error);
      res.status(500).json({ error: 'Error processing CV' });
    }
  } catch (error) {
    console.error('Error parsing form data:', error);
    res.status(500).json({ error: 'Error parsing form data' });
  }
};

export default handler;