// components/SettingInput.tsx
'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Props = {
  id: string
  type: string
  value: string | number | boolean | null | undefined
  options?: string[] | undefined
  placeholder?: string
  onValueChange: (v: string | number | boolean) => void
}

function SettingInputInner({ id, type, value, options = [], placeholder, onValueChange }: Props) {
  const [local, setLocal] = useState<string | number | boolean>(value ?? '')

  useEffect(() => {
    setLocal(value ?? '')
  }, [value])

  const commit = useCallback((val: string | number | boolean) => {
    onValueChange(val)
  }, [onValueChange])

  if (type === 'text') {
    return (
      <Textarea
        id={id}
        value={String(local)}
        onChange={(e) => {
          setLocal(e.target.value)
          commit(e.target.value)
        }}
        placeholder={placeholder}
        className="min-h-[100px]"
      />
    )
  }

  if (type === 'boolean') {
    return (
      <div className="flex items-center gap-2">
        <Switch
          checked={Boolean(local)}
          onCheckedChange={(v: boolean) => {
            setLocal(v)
            commit(v)
          }}
        />
      </div>
    )
  }

  if (type === 'number') {
    return (
      <Input
        id={id}
        type="number"
        value={local === null || local === undefined ? '' : String(local)}
        onChange={(e) => {
          const raw = e.target.value
          setLocal(raw)
          const num = raw === '' ? '' : Number(raw)
          commit(num)
        }}
        placeholder={placeholder}
      />
    )
  }

  if (type === 'select') {
    return (
      <Select value={String(local ?? '')} onValueChange={(v) => { setLocal(v); commit(v) }}>
        <SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger>
        <SelectContent>
          {options.map((opt) => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <Input
      id={id}
      value={String(local ?? '')}
      onChange={(e) => {
        setLocal(e.target.value)
        commit(e.target.value)
      }}
      placeholder={placeholder}
    />
  )
}

export default React.memo(SettingInputInner)
