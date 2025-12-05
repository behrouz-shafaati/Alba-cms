import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { CheckboxInput } from '../ui/checkbox-input'
import { Table } from '@tanstack/react-table'
import { useUrlFilter } from '@/hooks/use-url-filter'
import { useDebouncedCallback } from 'use-debounce'
import Combobox from '../form-fields/combobox'

interface FiltersProps<T> {
  table: Table<T>
}

export function Filters<T>({ table }: FiltersProps<T>) {
  const { setFilter, searchParams, isPending } = useUrlFilter()

  const handleChange = useDebouncedCallback((name: string, value: string) => {
    setFilter(name, value ?? null)
  }, 500)
  return (
    <div className="flex gap-4 flex-wrap">
      {table.getAllColumns().map((column) => {
        const config = column.columnDef.meta?.filterConfig
        if (!config) return null

        const key = (column.columnDef?.accessorKey as string) ?? column.id
        const title = (column.columnDef?.header as string) ?? column.id
        const filterValue = searchParams.get(key)?.toString() ?? ''

        switch (config.type) {
          case 'text':
            return (
              <Input
                key={column.id}
                placeholder={`فیلتر ${title}...`}
                value={filterValue ?? ''}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-40"
              />
            )
          case 'select':
            return (
              <Combobox
                key={column.id}
                name="templateFor"
                defaultValue={filterValue ?? ''}
                {...(config.options ? { options: config.options } : {})}
                {...(config.fetchOptions
                  ? { fetchOptions: config.fetchOptions }
                  : {})}
                placeholder={`فیلتر ${title}`}
                onChange={({ target }) => handleChange(key, target.value)}
                showClean={true}
              />
            )

          case 'boolean':
            return (
              <div key={column.id} className="flex items-center space-x-2">
                <CheckboxInput
                  checked={filterValue === 'true'}
                  onCheckedChange={(checked) =>
                    handleChange(key, checked ? 'true' : undefined)
                  }
                />
                <span>{column.id}</span>
              </div>
            )
        }
      })}
    </div>
  )
}
