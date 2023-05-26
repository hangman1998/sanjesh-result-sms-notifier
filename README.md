# Sanjesh SMS Notifier

This is a simple node.js project that watches sanjesh articles page for
any new articles and notifies user of of the new articles via SMS

## Packages

- `axios` for fetching the html content.
- `cheerio` for scraping the webpage.
- `dotenv` for using .env files.
- `node-cron` to recheck the webpage periodically.

## Setup

1. Create an account on `https://ghasedak.me/`.
2. Create a new api key in your Ghasedak Dashboard (remember to add your server's ip on the API's whitelist)
3. create a `.env` file and set `GHASEDAK_API_KEY`,`MY_PHONE_NUMBER`(can only be the phone number you signed up with) and `LINE_NUMBER`(use `10008566` if you are unsure) variables.
4. run `npm install` (make sure you already have node installed)
5. start the script with `npm run dev`
6. (optional) create a systemd service that runs this script on background
7. Enjoy 🥳

## Modification

### Changing script run interval

by default this script checks `sanjesh.org` on start of every minute.
update the `cron.schedule("* * * * *", checkSanjesh)` line to change the check rate.

EXAMPLE:
`cron.schedule("*/10 * * * *", checkSanjesh);`: makes the cron job run every once every 10 minutes.
