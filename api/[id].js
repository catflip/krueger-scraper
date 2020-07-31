const puppeteer = require('puppeteer-extra')
const chrome = require('chrome-aws-lambda');
const run = (async (id) => {

    const args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certifcate-errors',
        '--ignore-certifcate-errors-spki-list',
        '--user-agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36"'
    ];

    const options = {
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless:true,
    };
    const StealthPlugin = require('puppeteer-extra-plugin-stealth')
    puppeteer.use(StealthPlugin())
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    try{
        await page.setRequestInterception(true);
        const blockedResourceTypes = [
            'stylesheet',
            'media',
            'font',
            'texttrack',
            'object',
            'beacon',
            'csp_report',
            'imageset',
          ];
          
          const skippedResources = [
            'quantserve',
            'adzerk',
            'doubleclick',
            'adition',
            'exelator',
            'sharethrough',
            'cdn.api.twitter',
            'google-analytics',
            'googletagmanager',
            'google',
            'fontawesome',
            'facebook',
            'analytics',
            'optimizely',
            'clicktale',
            'mixpanel',
            'zedo',
            'clicksor',
            'tiqcdn',
            'bing',
            'pinterest',
            'demdex',
            'adobedtm',
            'pinimg',
            'go-mpulse',
            'adsrvr',
            'base64'
          ];
          page.on('request', request => {
            const requestUrl = request._url.split('?')[0].split('#')[0];
            console.log(requestUrl)
            if (
              blockedResourceTypes.indexOf(request.resourceType()) !== -1 ||
              skippedResources.some(resource => requestUrl.indexOf(resource) !== -1)
            ) {
              request.abort();
            } else {
              request.continue();
            }
          });
    // await page.goto("https://google.com")
        await page.goto('http://kroger.com/p/default-slug/'+id);
        // await page.waitForSelector("#root > div.Page.PinnedCartLayout.controlled > div.Page-outer-block.stack-base > div:nth-child(3) > div > div > div:nth-child(6) > button.kds-Button.kds-Button--primary.DynamicTooltip--Button--Confirm.float-right",{timeout:3000})
        // await page.click("#root > div.Page.PinnedCartLayout.controlled > div.Page-outer-block.stack-base > div:nth-child(3) > div > div > div:nth-child(6) > button.kds-Button.kds-Button--primary.DynamicTooltip--Button--Confirm.float-right")
        await page.waitForSelector('div.ProductCard',{timeout:5000})
        const s = await page.evaluate(() => {
            const image=document.querySelector("div.ProductCard > div:nth-of-type(2) > a > div >img").src;
            const priceOriginal=document.querySelector("span.kds-Price-singular")?document.querySelector("span.kds-Price-singular").innerText:document.querySelector("s.kds-Price-original")?document.querySelector("s.kds-Price-original").innerText:null;
            const pricePromotional=document.querySelector("mark.kds-Price-promotional")?document.querySelector("mark.kds-Price-promotional").innerText:null;
            const title=document.querySelector("h3.kds-Text--m.text-default-800.mt-12.mb-4.font-500").innerText;
            const weight=document.querySelector("div.ProductCard-sellBy.ProductCard-sellBy-unit").innerText;
            const info=document.querySelector("div.ModalityInfo").innerText;
            return {image,priceOriginal,pricePromotional,title,weight,info};
          });
          console.log(s)
        // const preloadFile = fs.readFileSync('./preload.js', 'utf8');
        // await page.evaluateOnNewDocument(preloadFile);
        // await browser.close()
        return {status:true,data:s,message:"success"}
    }catch(e){
        // await browser.close()
        return {status:false,data:null,message:e.message}

    }
    
})
// 0002840058989
run(0004126036284)
// module.exports = async (req, res) => {
//     const {id}=req.query
//     const data=await run(id)
//     res.json(data)
//   }