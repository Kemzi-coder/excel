const CODES = {
   A: 65,
   Z: 90
}

export const colsCount = CODES.Z - CODES.A + 1



function toCell(row) {
   return function(_, col) {
      return `
       <div class="cell" data-type="cell" data-col="${col}" data-id="${row}:${col}" contenteditable></div>
      `
   }
}

function toColumn(letter, index) {
   return `
      <div class="column" data-type="resizable" data-col="${index}">
         ${letter}
         <div class="col-resize" data-resize="col"></div>
      </div>
   `
}

function createRow(index, content) {
   const resize = index ? '<div class="row-resize" data-resize="row"></div>' : ''
   return `
      <div class="row" data-type="resizable">
         <div class="row-info">
            ${index ? index : ''}
            ${resize}
         </div>
         <div class="row-data">${content}</div>
      </div>
   `
}

function toChar(_, index) {
   return String.fromCharCode(CODES.A + index)
}

export function createTable(rowsCount = 15) {
   const rows = []
   const cols = new Array(colsCount)
   .fill('')
   .map(toChar)
   .map(toColumn)
   .join('')

   
   rows.push(createRow(null, cols))


   for (let row = 0; row < rowsCount; row++) {
      const cells = new Array(colsCount)
      .fill('')
      .map(toChar)
      .map(toCell(row))
      .join('')

      rows.push(createRow(row + 1, cells))
   }

   return rows.join('')
}



