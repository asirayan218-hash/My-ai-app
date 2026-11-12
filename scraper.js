const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeQuotes() {
  try {
    console.log('Fetching quotes...');
    const { data } = await axios.get('http://quotes.toscrape.com/');
    const $ = cheerio.load(data);

    // Pehle 3 quotes aur unke authors nikalte hain
    $('.quote').each((i, el) => {
      if (i < 3) {
        const quote = $(el).find('.text').text();
        const author = $(el).find('.author').text();
        console.log(`\n[Quote ${i+1}]`);
        console.log(`Text: ${quote}`);
        console.log(`Author: ${author}`);
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

scrapeQuotes();
