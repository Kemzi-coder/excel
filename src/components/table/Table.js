import { ExcelComponent } from "../../core/ExcelComponent";
import { createTable } from "./table.template";
import { resizeHandler } from "./table.resize";
import {isCell, matrix, nextSelector, shouldResize} from "./table.functions";
import {TableSelection} from "./TableSelection";
import {$} from "../../core/dom";

export class Table extends ExcelComponent {
   static className = 'excel__table'
   static rowsCount = 20

   constructor($root, options) {
      super($root, {
         name: 'Table',
         listeners: ['mousedown', 'keydown', 'input'],
         ...options
      })
   }

   prepare() {
      this.selection = new TableSelection()
   }


   init() {
      super.init()

      this.selectCell(this.$root.find('[data-id="0:0"]'))

      this.$on('formula:input', (text) => {
         this.selection.current.text(text)
      })

      this.$on('formula:done', () => {
         this.selection.current.focus()
      })
   }

   selectCell($cell) {
      this.selection.select($cell)
      this.$emit('table:select', $cell)
   }

   toHTML() {
      return createTable(Table.rowsCount)
   }

   onMousedown(event) {
      if (shouldResize(event)) {
         resizeHandler(this.$root, event)
      } else if (isCell(event)) {
         this.$target = $(event.target)

         if (event.shiftKey) {
            const $cells = matrix(this.$target, this.selection.current)
               .map(id => this.$root.find(`[data-id="${id}"`))
            this.selection.selectGroup($cells)
         } else {
            this.selection.select(this.$target)
         }
      }
   }

   onKeydown(event) {
      const keys = ['Enter', 'Tab', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown']

      const {key} = event

      if (keys.includes(event.key) && !event.shiftKey) {
         event.preventDefault()

         const id = this.selection.current.id(true)

         const $next = this.$root.find(nextSelector(key, id))
         this.selectCell($next)
      }
   }

   onInput(event) {
      this.$emit('table:input', $(event.target))
   }
}

