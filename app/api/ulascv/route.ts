import { Configuration, OpenAIApi } from "openai-edge";
import { NextRequest, NextResponse } from 'next/server';
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
        return new Response("File not found", { status: 400 });
    }

    const fileContent = await file.text(); // Read file content as text

    const response = await openai.createChatCompletion({
        model: "gpt-4-vision-preview",
        stream: true,
        max_tokens: 5000,
        messages: [
            {
                role: "user",
                content: `Ulaslah CV berikut ini, nilailah berdasarkan secara keseluruhan apakah sudah cukup baik atau belum. Dan juga nilai berdasarkan contact information, dan relevant skills. Ulaslah dengan menggunakan bahasa Indonesia yang baik.\n\nCV:\n\n${fileContent}`
            }
        ]
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
}

export const config = {
    api: {
        bodyParser: false,
    },
};