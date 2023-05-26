import axios from "axios";
import { load } from "cheerio";
import { writeFileSync, readFileSync } from "fs";
import lodash from "lodash";
import { config } from "dotenv";
import cron from "node-cron";

config(); // loading .env variables into process.env

const notifyUser = (msg) => {
  const formData = new URLSearchParams();
  formData.append("message", msg);
  formData.append("receptor", process.env.MY_PHONE_NUMBER);
  formData.append("linenumber", process.env.LINE_NUMBER);
  axios.post(
    "https://api.ghasedak.me/v2/sms/send/simple",
    formData.toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        apikey: process.env.GHASEDAK_API_KEY,
      },
    }
  );
};

async function checkSanjesh() {
  const sanjeshURL =
    "https://sanjesh.org/fa-IR/Portal/4960/page/%D8%A7%D8%AE%D8%A8%D8%A7%D8%B1-%DA%A9%D8%A7%D8%B1%D8%B4%D9%86%D8%A7%D8%B3%DB%8C-%D8%A7%D8%B1%D8%B4%D8%AF";
  const { titles: savedArticleTitles } = JSON.parse(
    readFileSync("articles.json")
  );
  try {
    const response = await axios.get(sanjeshURL);
    const html = response.data;
    const $ = load(html);
    // writing the logic that fetches the content and compares it with the last version.
    const articleTitles = $("#ctl01_ctl00_NewsList span") // sanjesh new articles are spans in this list
      .map((_, e) => $(e).text())
      .toArray();

    const newArticleTitles = lodash.difference(
      articleTitles,
      savedArticleTitles
    );

    if (newArticleTitles.length > 0) {
      // sanjesh has posted new articles.
      // updating our file database with the new articles
      writeFileSync(
        "articles.json",
        JSON.stringify({ titles: savedArticleTitles.concat(newArticleTitles) })
      );
      // notifying the user of the new articles
      const notification = `${
        newArticleTitles.length
      } اطلاعیه جدید\n${newArticleTitles.join("\n")}`;
      notifyUser(notification);
      console.log(
        `${new Date()}: ${
          newArticleTitles.length
        } articles were added to sanjesh`
      );
    } else {
      console.log(`${new Date()}: no new articles`);
    }
  } catch (error) {
    console.error("error connecting to sanjesh ", error);
  }
}

cron.schedule("* * * * *", checkSanjesh);
