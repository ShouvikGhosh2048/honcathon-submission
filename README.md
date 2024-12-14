# HONCATHON Pictionary

A pictionary app. The app contains a frontend located at the '/' route, and two api endpoints '/api/topic' and '/api/image'.

You can try the app [here](https://goose-quotes.honcathonshouvikghosh2048.workers.dev/).

## Run locally
This is an app using [HONC](https://honc.dev/). You can install and run it using `npm install` and `npm run dev`. The project uses Cloudflare AI, so you will need a Cloudflare account to run this app locally.

There are 3 endpoints:

- `/` - This is the homepage. It returns HTML, and you can visit it in your browser.
- `/api/topic` - This endpoint is used with a GET request, and takes two query parameters:
  - `baseTopic`: A string representing the category used to generate a topic.
  - `skip`: A string consisting of a comma seperated list of categories to skip when generating.
  
  This endpoint returns the generated topic as a string.
- `/api/image` - This endpoint is used with a GET request, and takes one query parameter:
  - `topic`: The topic for which we need to generate the image.

  This endpoint returns the image as a base64 string.
