import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

const auth = getAuth();
const db = getFirestore();

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Verify the user's authentication token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No valid authentication token provided' });
        }

        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await auth.verifyIdToken(idToken);
        const userId = decodedToken.uid;

        const { message, chatId } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Call OpenAI API
        const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `You are Riley Brown's AI assistant. Riley is "The Number One AI Educator" based in San Francisco Bay. He's the co-founder of VibeCode (an AI-powered app building platform) and creator of "Vibe Coding" methodology. You should be helpful, knowledgeable about AI, and embody Riley's educational and innovative spirit. Keep responses conversational and engaging.`
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 500,
            }),
        });

        if (!openAIResponse.ok) {
            throw new Error('OpenAI API request failed');
        }

        const openAIData = await openAIResponse.json();
        const aiMessage = openAIData.choices[0].message.content;

        // Save chat to Firestore
        let newChatId = chatId;
        if (!newChatId) {
            // Create new chat
            const chatRef = await db.collection('chats').add({
                userId: userId,
                title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
                createdAt: new Date(),
                updatedAt: new Date(),
                isPublic: false,
                messages: [
                    {
                        role: 'user',
                        content: message,
                        timestamp: new Date()
                    },
                    {
                        role: 'assistant',
                        content: aiMessage,
                        timestamp: new Date()
                    }
                ]
            });
            newChatId = chatRef.id;
        } else {
            // Update existing chat
            const chatRef = db.collection('chats').doc(newChatId);
            await chatRef.update({
                updatedAt: new Date(),
                messages: require('firebase-admin/firestore').FieldValue.arrayUnion(
                    {
                        role: 'user',
                        content: message,
                        timestamp: new Date()
                    },
                    {
                        role: 'assistant',
                        content: aiMessage,
                        timestamp: new Date()
                    }
                )
            });
        }

        res.status(200).json({
            message: aiMessage,
            chatId: newChatId
        });

    } catch (error) {
        console.error('Error in chat API:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}