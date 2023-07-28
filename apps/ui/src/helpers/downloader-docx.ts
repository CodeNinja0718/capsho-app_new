import {
  convertInchesToTwip,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  NumberFormat,
  TextRun,
  AlignmentType,
  PageNumber,
  // Header,
  Footer
} from 'docx'
import { exportFile, Loading } from 'quasar'
import { useNotification } from 'src/composables/useNotification'

export default function downloadDocx(
  {
    data,
    heading,
    fileName,
    title,
    description,
    mainTitleItalics = false,
    isAllAssets = false
  }:
    {
      data: Paragraph[];
      heading: string;
      fileName: string;
      title?: string;
      description?: string;
      mainTitleItalics?: boolean;
      isAllAssets?: boolean;
    }
) {
  const { triggerPositive, triggerWarning } = useNotification()
  Loading.show()
  const normalFooterText = isAllAssets ? 'Capsho (All Assets) ' : `Capsho (${heading}) `
  const doc = new Document({
    creator: 'Capsho AI',
    description,
    title,
    styles: {
      default: {
        title: {
          run: {
            size: 48,
            color: '6267DA',
            italics: mainTitleItalics
          }
        },
        heading2: {
          run: {
            size: 34,
            color: '000000'
          },
          paragraph: {
            spacing: {
              line: 276,
              after: 200
            }
          }
        },
        heading3: {
          run: {
            size: 36,
            color: '3E3E3E'
          },
          paragraph: {
            indent: {
              left: convertInchesToTwip(0.2)
            },
            spacing: {
              line: 276,
              before: 20 * 72 * 0.1,
              after: 100
            }
          }
        },
        heading4: {
          run: {
            size: 33,
            color: '14142B'
          },
          paragraph: {
            indent: {
              left: convertInchesToTwip(0.2)
            },
            spacing: {
              line: 276,
              before: 100,
              after: 100
            }
          }
        },
        heading5: {
          run: {
            size: 29,
            color: '14142B',
            bold: true,
            font: 'Poppins'
          },
          paragraph: {
            indent: {
              left: convertInchesToTwip(0.2)
            },
            spacing: {
              line: 276,
              before: 200,
              after: 200
            }
          }
        },
        listParagraph: {
          run: {
            size: 26
          }
        }
      },
      paragraphStyles: [
        {
          id: 'basic',
          name: 'Basic',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            size: 29,
            color: '3E3E3E',
            font: 'Inter'
          },
          paragraph: {
            indent: {
              left: convertInchesToTwip(0.2)
            },
            spacing: {
              line: 276,
              before: 20 * 72 * 0.1,
              after: 20 * 72 * 0.05
            }
          }
        },
        {
          id: 'aside',
          name: 'Aside',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            size: 26,
            color: '999999',
            italics: true
          },
          paragraph: {
            indent: {
              left: convertInchesToTwip(0.5)
            },
            spacing: {
              line: 276
            }
          }
        },
        {
          id: 'wellSpaced',
          name: 'Well Spaced',
          basedOn: 'Normal',
          quickFormat: true,
          paragraph: {
            spacing: { line: 276, before: 20 * 72 * 0.1, after: 20 * 72 * 0.05 }
          }
        },
        {
          id: 'myLinkedInStyle',
          name: 'LinkedIn Article Style',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            size: 26,
            color: '111111'
          },
          paragraph: {
            spacing: {
              line: 276
            },
            indent: {
              left: 720
            }
          }
        }
      ]
    },
    sections: [
      {
        properties: {
          page: {
            pageNumbers: {
              start: 1,
              formatType: NumberFormat.DECIMAL
            }
          }
        },
        // headers: {
        //   default: new Header({
        //     children: [
        //       new Paragraph({
        //         text: heading
        //       })
        //     ]
        //   })
        // },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: normalFooterText
                  }),
                  new TextRun({
                    children: [' ', PageNumber.CURRENT]
                  }),
                  new TextRun({
                    children: [' of ', PageNumber.TOTAL_PAGES]
                  })
                ]
              })
            ]
          })
        },
        children: [
          new Paragraph({
            text: heading,
            heading: HeadingLevel.TITLE,
            thematicBreak: true
          }),
          ...data
        ]
      }
    ]
  })
  let status: boolean | Error
  Packer
    .toBlob(doc)
    .then((blob) => {
      status = exportFile(fileName, blob)
    })
    .finally(() => {
      const timer = setTimeout(() => {
        Loading.hide()
        if (status === true) {
          triggerPositive('Successful download')
        } else {
          triggerWarning('Error: ' + status)
        }
        clearTimeout(timer)
      }, 600)
    })
}
