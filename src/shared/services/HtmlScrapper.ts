import { JSDOM } from 'jsdom';
import LanguageDetect from 'languagedetect';

class HtmlScrapper {
  private document;
  private html;

  constructor(html: string) {
    try {
      const { document } = new JSDOM(html).window;
      this.document = document;
      this.html = html.trim();
    } catch {
      throw new Error();
    }
  }

  getDocument() {
    return this.document;
  }

  // Returns ISO 639 code
  getLanguage(): string {
    const htmlLanguage = this.document.querySelector('html')?.lang;
    const htmlLanguageOrUndefined = !!htmlLanguage?.length ? htmlLanguage : undefined;
    const ogLocale = this.document.querySelector('meta[property="og:locale"]')?.content;

    const lngDetector = new LanguageDetect();
    lngDetector.setLanguageType('iso2');
    const languageDetected = lngDetector.detect(this.html);
    const [[languageDetectedOrUndefined]] = !!languageDetected.length ? languageDetected : [[undefined]];
    const returnedLanguage = htmlLanguageOrUndefined || ogLocale || languageDetectedOrUndefined;

    const langToISO639 = returnedLanguage?.split('-')[0]; // from "en-EN" to "en"

    return langToISO639;
  }

  getKeywords(): string[] {
    const keywordsString = this.document.querySelector('meta[name="keywords"]')?.content;

    const keywords = keywordsString?.split(',');
    const trimmedKeywords = keywords?.map((item: string) => item.trim());

    const returnKeywords = !!trimmedKeywords?.length ? trimmedKeywords : undefined;

    return returnKeywords;
  }

  getDescription(): string {
    const description = this.document.querySelector('meta[name="description"]')?.content?.trim();
    const ogDescription = this.document.querySelector('meta[property="og:description"]')?.content?.trim();

    const returnedDescription = description || ogDescription;

    return returnedDescription;
  }

  getImage(): string {
    const ogImage = this.document.querySelector('meta[property="og:image"]')?.content;

    const returnedImage = ogImage;

    return returnedImage;
  }

  getType(): string {
    const ogType = this.document.querySelector('meta[property="og:type"]')?.content;

    const returnedType = ogType;

    return returnedType;
  }

  getAuthor(): string {
    const author = this.document.querySelector('meta[name="author"]')?.content;

    return author;
  }

  getTitle(): string {
    const documentTitle = this.document.title;
    const ogTitle = this.document.querySelector('meta[property="og:title"]')?.content;
    const ogSiteName = this.document.querySelector('meta[property="og:og:site_name"]')?.content;

    const returnedTitle = documentTitle || ogTitle || ogSiteName;

    return returnedTitle;
  }

  getFavicon(domain: string): string {
    // TODO: develop logic
    // const htmlFaviconTag = this.document.querySelector("link[rel*='icon']");
    // const htmlFaviconUrl = htmlFaviconTag?.href;
    // const isOnlyFavicon = htmlFaviconUrl === 'favicon.ico'; // TODO: Need a proper regex here. Also remove leading slash
    // const htmlFaviconIsAbsolute = htmlFaviconUrl.startsWith('/');
    // const htmlFaviconTagWithDomain =
    //   (isOnlyFavicon && `${domain}/${htmlFaviconUrl}`) || (htmlFaviconIsAbsolute && `${domain}${htmlFaviconUrl}`) || htmlFaviconUrl;
    // const htmlFaviconContent = htmlFaviconTag?.content && `${domain}${htmlFaviconTag.content}`;
    // Google S2 favicon service
    const googleFavicon = `https://www.google.com/s2/favicons?domain=${domain}`;

    const returnedFavicon = googleFavicon;

    return returnedFavicon;
  }

  getDefaultFavicon(domain: string): string {
    return `https://www.google.com/s2/favicons?domain=${domain}`;
  }
}

export default HtmlScrapper;
