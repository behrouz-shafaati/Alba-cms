'use client'
import { ColumnDef } from '@tanstack/react-table'
import { CellAction } from './cell-action'
import { CheckboxInput as Checkbox } from '@/components/ui/checkbox-input'
import { FormSubmission } from '@/features/form-submission/interface'
import { Status } from '@/components/Status'
import { getTranslation, truncateWords } from '@/lib/utils'

export const columns = (formFields: any): ColumnDef<FormSubmission>[] => {
  let countColumnsToShow = 5
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    ...formFields.slice(0, countColumnsToShow).map((f: any) => {
      return {
        accessorKey: `values.${f.name}`,
        header: f.label?.['fa'],
        cell: ({ row }) => {
          const translation = getTranslation({
            translations: row.original.translations,
          })
          return truncateWords(translation.values[f.name])
        },
      }
    }),
    {
      accessorKey: 'status',
      header: 'وضعیت',
      cell: ({ row }) => <Status row={row} />,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <CellAction data={row.original} formFields={formFields} />
      ),
    },
  ]
}
