import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express()
const port = process.env.PORT || 8083
const endpoint = 'https://api.openai.com/v1/chat/completions'
app.set('view engine', 'ejs')
app.set(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('index', {
        originalText:'',
        corrected: ''
    })
})

app.post('/correct', async (req, res) => {
    //userText
    console.log(req.body)
            const userText = req.body.text.trim()
    if (!userText) {
        res.render('index', {
            corrected: 'Please provide input some text'
        })
    }
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Contet-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENAI_KEY}`
            },
            body: JSON.stringify({
                "model": "gpt-4o-mini",
                "messages": [{ role: "system", content: 'You are a great assistant' },
                { role: "user", content: `Correct the following text:${userText}` }]

            }),
            max_tokens: 100,
            n: 1,
            stop: null,
            temperature: 1,
        })
        if(!response.ok){
            res.render('index',{
                corrected:'Error. Please try again',
                originalText: userText,

            })
        }
        const data = await response.json()
        const correctedText = data.choices[0].message.content
        res.render('index',{
            corrected: correctedText,
            originalText: userText
        })
    } catch (error) {
        res.render('index',{
            corrected: 'Error. Please try again',
            originalText: userText
        })
    }  
})




app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})