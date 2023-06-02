import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

type FlexObject = {
  flex: number;
  flexBasis: string | 0;
};

export const config = {
  runtime: 'edge',
};

const Inter = fetch(new URL('../assets/fonts/Inter.ttf', import.meta.url)).then(
  (res) => res.arrayBuffer()
);

const SourceCodePro = fetch(
  new URL('../assets/fonts/SourceCodePro.ttf', import.meta.url)
).then((res) => res.arrayBuffer());

const fullWidth = {
  display: 'flex',
  padding: '0 80px',
  width: '100%',
};

const textBox = {
  background: 'rgba(19, 17, 38, 0.6)',
  border: '1px solid #B93C9B',
  display: 'flex',
};

const textBoxCodeText = {
  ...textBox,
  color: '#B93C9B',
  margin: '0 10px',
  fontFamily: '"Source Code Pro"',
  fontSize: 20,
  alignItems: 'center',
  justifyContent: 'center',
  padding: '5px 0',
  position: 'relative' as 'relative',
};

const dot = {
  background: '#D9D9D9',
  border: '1px solid #B93C9B',
  width: 8,
  height: 8,
  display: 'flex',
  position: 'absolute' as 'absolute',
};

export default async function handler(request: NextRequest) {
  const interFont = await Inter;
  const sourceFont = await SourceCodePro;

  const { searchParams } = new URL(request.url);

  const name = searchParams.get('name') || '';
  const nameSize = searchParams.get('size') || '';
  const bootstrapColumnsLength = 12;
  const bootstrapColumnWidth = 90;
  let nameColumns = Math.ceil(+nameSize / bootstrapColumnWidth);
  let emojisColumns = bootstrapColumnsLength - nameColumns;

  if (nameColumns > 9) {
    nameColumns = 9;
    emojisColumns = 3;
  }

  const flexColumns = (nameColumns: number, emojisColumns: number) => {
    let flexName: FlexObject = { flex: 0, flexBasis: 0 };
    let flexEmojis: FlexObject = { flex: 0, flexBasis: 0 };

    const calcBasis = (number: number) => {
      switch (number) {
        case 7:
          return 10;
        case 8:
          return 20;
        case 9:
          return 40;
        default:
          return 0;
      }
    };

    if (nameColumns === emojisColumns) {
      flexName = { flex: nameColumns, flexBasis: 0 };
      flexEmojis = { flex: emojisColumns, flexBasis: 0 };

      return [flexName, flexEmojis];
    }

    flexName = {
      flex: nameColumns,
      flexBasis:
        nameColumns > emojisColumns ? `${calcBasis(nameColumns)}px` : 0,
    };
    flexEmojis = {
      flex: emojisColumns,
      flexBasis:
        emojisColumns > nameColumns ? `${calcBasis(emojisColumns)}px` : 0,
    };

    return [flexName, flexEmojis];
  };

  const happyEmojis = '😊 😍 😂 🤣 😁 😆 😜 😝 🤩 😜 🤑 ⚡ ✨ 🚀';
  const emojiArray = happyEmojis.split(' ');

  function getRandomIndex() {
    return Math.floor(Math.random() * emojiArray.length);
  }

  let emojis = '';
  for (let i = 0; i < emojisColumns; i++) {
    emojis += emojiArray[getRandomIndex()].concat(' ');
  }

  function Column() {
    return (
      <div
        style={{
          background:
            'linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0) 100%)',
          height: '100vh',
          flex: 1,
          margin: 10,
        }}
      ></div>
    );
  }

  try {
    return new ImageResponse(
      (
        <>
          <div
            style={{
              backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/bg.svg)`,
              display: 'flex',
              height: 900,
              width: 1440,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ ...fullWidth, position: 'absolute' }}>
              {[...Array(bootstrapColumnsLength)].map((index: number) => (
                <Column key={index} />
              ))}
            </div>

            <div
              style={{
                backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/logo.svg)`,
                width: 415,
                height: 125,
                marginBottom: 100,
              }}
            />
            <div
              style={{
                backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/text.svg)`,
                width: 407,
                height: 51,
                marginBottom: 30,
              }}
            />

            <div style={fullWidth}>
              <div
                style={{
                  ...textBoxCodeText,
                  ...flexColumns(nameColumns, emojisColumns)[0],
                }}
              >
                {`<div class="col-${nameColumns}">`}
              </div>
              <div
                style={{
                  ...textBoxCodeText,
                  ...flexColumns(nameColumns, emojisColumns)[1],
                }}
              >
                {`<div class="col-${emojisColumns}">`}
              </div>
            </div>

            <div style={{ ...fullWidth, marginBottom: 60 }}>
              <div
                style={{
                  ...textBox,
                  ...flexColumns(nameColumns, emojisColumns)[0],
                  color: '#fff',
                  margin: 10,
                  fontFamily: '"Inter"',
                  fontSize: 55,
                }}
              >
                <span style={{ ...dot, top: '-4px', left: '-4px' }} />
                <span style={{ ...dot, top: '-4px', right: '-4px' }} />
                <span style={{ ...dot, bottom: '-4px', left: '-4px' }} />
                <span style={{ ...dot, bottom: '-4px', right: '-4px' }} />
                <span
                  style={{
                    display: 'flex',
                    padding: 10,
                    width: '100%',
                    letterSpacing: '-0.5px',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {name}
                </span>
              </div>
              <div
                style={{
                  ...textBox,
                  ...flexColumns(nameColumns, emojisColumns)[1],
                  margin: 10,
                  fontSize: 55,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ ...dot, top: '-4px', left: '-4px' }} />
                <span style={{ ...dot, top: '-4px', right: '-4px' }} />
                <span style={{ ...dot, bottom: '-4px', left: '-4px' }} />
                <span style={{ ...dot, bottom: '-4px', right: '-4px' }} />
                {emojis}
              </div>
            </div>

            <div
              style={{
                backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/footer.svg)`,
                width: 1263,
                height: 211,
              }}
            />
          </div>
        </>
      ),
      {
        width: 1440,
        height: 900,
        emoji: 'fluent',
        fonts: [
          {
            data: interFont,
            name: 'Inter',
          },
          {
            data: sourceFont,
            name: 'Source Code Pro',
          },
        ],
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Falha ao gerar a imagem :(`, {
      status: 500,
    });
  }
}
