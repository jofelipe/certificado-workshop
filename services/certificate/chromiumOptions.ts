import chromium from '@sparticuz/chromium-min';

interface Options {
  args: string[];
  executablePath: string;
  headless: boolean | 'new';
}

export async function getOptions(isDev: boolean): Promise<Options> {
  let options: Options;

  if (isDev) {
    options = {
      args: [],
      executablePath:
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true,
    };
  } else {
    options = {
      args: chromium.args,
      executablePath: await chromium.executablePath(
        `${process.env.NEXT_PUBLIC_URL}/chromium-v113.0.1-pack.tar`
      ),
      headless: chromium.headless,
    };
  }

  return options;
}
