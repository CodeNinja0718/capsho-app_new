import { jsPDF as JSPDF } from 'jspdf'
import { Loading } from 'quasar'
import { useNotification } from 'src/composables/useNotification'

type Paging = 'text' | 'slice'
/**
 * Convert and save HTML content to PDF
 * @param {HTMLElement | null | string} elementHTML - Source HTMLElement or a string containing HTML.
 * @param {string} fileName
 * @param {string | boolean} autoPaging
 */
export default function convertHtmlToPdf(
  elementHTML: HTMLElement | null | string,
  fileName = 'document.pdf',
  autoPaging: Paging | boolean | undefined = 'text'
) {
  const doc = new JSPDF()

  if (!elementHTML) {
    return
  }
  const { triggerPositive, triggerWarning } = useNotification()
  doc.setFont('times', 'normal')
  Loading.show()
  doc.html(elementHTML, {
    callback: function(doc) {
      // Save the PDF
      Promise.resolve(doc.save(fileName))
        .catch((err) => {
          triggerWarning(err.message)
        })
        .finally(() => {
          const timer = setTimeout(() => {
            triggerPositive('Successful download')
            Loading.hide()
            clearTimeout(timer)
          }, 600)
        })
    },
    margin: [10, 10, 10, 10],
    autoPaging,
    x: 0,
    y: 0,
    width: 190, // target width in the PDF document
    windowWidth: 675 // window width in CSS pixels
  })
}

export function downloadAll(
  data: object,
  fileName: string
) {
  const doc = new JSPDF()

  if (!data) {
    return
  }
  // const { triggerPositive, triggerWarning } = useNotification()
  doc.setFont('poppins', 'normal')
  doc.text('All Assets', 20, 50)
  Loading.show()
  for (const value of Object.values(data)) {
    if (typeof value === 'string') {
      doc.text(value, 20, 20)
      doc.addPage()
    }
  }
  doc.save(fileName)
  Loading.hide()
}
