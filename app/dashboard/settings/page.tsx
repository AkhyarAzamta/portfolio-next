'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  CogIcon,
  EyeIcon,
  PaintBrushIcon,
  ShareIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChartBarIcon,
  PlusIcon,
  TrashIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline'

// Shadcn/ui components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { NewSettingForm, Settings as SettingsType, Setting, SettingType, SettingCategory } from '@/types'

import SettingInput from '@/app/dashboard/settings/components/SettingInput'

// Color configuration for different categories
const categoryColors = {
  general: {
    bg: 'bg-[var(--color-general-bg)]',
    border: 'border-[var(--color-general-border)]',
    text: 'text-[var(--color-general-text)]',
    icon: 'text-[var(--color-general-icon)]'
  },
  appearance: {
    bg: 'bg-[var(--color-appearance-bg)]',
    border: 'border-[var(--color-appearance-border)]',
    text: 'text-[var(--color-appearance-text)]',
    icon: 'text-[var(--color-appearance-icon)]'
  },
  seo: {
    bg: 'bg-[var(--color-seo-bg)]',
    border: 'border-[var(--color-seo-border)]',
    text: 'text-[var(--color-seo-text)]',
    icon: 'text-[var(--color-seo-icon)]'
  },
  social: {
    bg: 'bg-[var(--color-social-bg)]',
    border: 'border-[var(--color-social-border)]',
    text: 'text-[var(--color-social-text)]',
    icon: 'text-[var(--color-social-icon)]'
  },
  contact: {
    bg: 'bg-[var(--color-contact-bg)]',
    border: 'border-[var(--color-contact-border)]',
    text: 'text-[var(--color-contact-text)]',
    icon: 'text-[var(--color-contact-icon)]'
  },
  email: {
    bg: 'bg-[var(--color-email-bg)]',
    border: 'border-[var(--color-email-border)]',
    text: 'text-[var(--color-email-text)]',
    icon: 'text-[var(--color-email-icon)]'
  }
}

// PERBAIKAN: Pisahkan komponen SettingCard untuk mencegah re-render
const SettingCard = React.memo(({ 
  category, 
  title, 
  description, 
  icon: Icon,
  settings,
  onUpdateSetting,
  onEditSetting,
  onDeleteSetting,
  onCreateSetting
}: {
  category: SettingCategory
  title: string
  description: string
  icon: React.ElementType
  settings: SettingsType
  onUpdateSetting: (key: string, value: string | number | boolean) => void
  onEditSetting: (setting: Setting) => void
  onDeleteSetting: (settingId: string) => void
  onCreateSetting: (category: SettingCategory) => void
}) => {
  const categorySettings = Object.entries(settings)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, setting]) => setting.category === category)
    .sort(([,a], [,b]) => a.order - b.order)

  if (categorySettings.length === 0) return null

  const colors = categoryColors[category]

  return (
    <Card className={`${colors.bg} ${colors.border} border-2 transition-all duration-300 hover:shadow-lg`}>
      <CardHeader className="pb-4">
        <CardTitle className={`flex items-center justify-between ${colors.text}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colors.bg} border ${colors.border}`}>
              <Icon className={`h-6 w-6 ${colors.icon}`} />
            </div>
            <span className="text-xl font-bold">{title}</span>
          </div>
          <Button 
            size="sm" 
            onClick={() => onCreateSetting(category)}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Setting
          </Button>
        </CardTitle>
        <CardDescription className={`${colors.text} opacity-80`}>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {categorySettings.map(([key, setting]) => (
          <SettingItem
            key={key}
            settingKey={key}
            setting={setting}
            colors={colors}
            onUpdate={onUpdateSetting}
            onEdit={onEditSetting}
            onDelete={onDeleteSetting}
          />
        ))}
      </CardContent>
    </Card>
  )
})

SettingCard.displayName = 'SettingCard'

// PERBAIKAN: Pisahkan komponen SettingItem untuk optimisasi lebih lanjut
const SettingItem = React.memo(({
  settingKey,
  setting,
  colors,
  onUpdate,
  onEdit,
  onDelete
}: {
  settingKey: string
  setting: Setting
  colors: typeof categoryColors[SettingCategory]
  onUpdate: (key: string, value: string | number | boolean) => void
  onEdit: (setting: Setting) => void
  onDelete: (settingId: string) => void
}) => {
  return (
    <div className={`p-4 rounded-lg border ${colors.border} bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-3">
        <Label htmlFor={settingKey} className={`text-base font-semibold ${colors.text}`}>
          {setting.label}
        </Label>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(setting)}
            className={`border ${colors.border} hover:${colors.bg}`}
          >
            <PencilSquareIcon className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                <TrashIcon className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white dark:bg-gray-900">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the setting
                  &quot;{setting.label}&quot;.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onDelete(setting.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <SettingInput
        id={settingKey}
        type={setting.type}
        value={setting.value}
        options={setting.options ?? []}
        placeholder={setting.description ?? ''}
        onValueChange={(v) => onUpdate(settingKey, v)}
      />
      
      {setting.description && (
        <p className={`text-sm mt-2 ${colors.text} opacity-70`}>
          {setting.description}
        </p>
      )}
      
      <div className="flex justify-between items-center text-xs mt-3 opacity-60">
        <span className={colors.text}>Key: {settingKey}</span>
        <span className={colors.text}>Type: {setting.type}</span>
        <span className={colors.text}>Order: {setting.order}</span>
      </div>
    </div>
  )
})

SettingItem.displayName = 'SettingItem'

// PERBAIKAN: Pisahkan komponen CreateSettingDialog untuk isolasi state
const CreateSettingDialog = React.memo(({
  open,
  onOpenChange,
  onCreateSetting,
  initialCategory
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateSetting: (setting: NewSettingForm) => Promise<void>
  initialCategory: SettingCategory
}) => {
  const [newSetting, setNewSetting] = useState<NewSettingForm>({
    key: '',
    value: '',
    type: 'string',
    category: initialCategory,
    label: '',
    description: '',
    options: [],
    order: 0
  })

  // Reset form ketika dialog dibuka/ditutup
  useEffect(() => {
    if (open) {
      setNewSetting({
        key: '',
        value: '',
        type: 'string',
        category: initialCategory,
        label: '',
        description: '',
        options: [],
        order: 0
      })
    }
  }, [open, initialCategory])

  const handleCreate = async () => {
    await onCreateSetting(newSetting)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create New Setting
          </DialogTitle>
          <DialogDescription>
            Add a new custom setting to your website configuration.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="key">Key</Label>
              <Input
                id="key"
                value={newSetting.key}
                onChange={(e) => setNewSetting(prev => ({ ...prev, key: e.target.value }))}
                placeholder="unique_setting_key"
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                value={newSetting.type} 
                onValueChange={(value: SettingType) => setNewSetting(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={newSetting.label}
              onChange={(e) => setNewSetting(prev => ({ ...prev, label: e.target.value }))}
              placeholder="Display label for the setting"
              className="focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newSetting.description}
              onChange={(e) => setNewSetting(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description of what this setting does"
              className="focus:ring-2 focus:ring-blue-500 min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={newSetting.category} 
                onValueChange={(value: SettingCategory) => setNewSetting(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="appearance">Appearance</SelectItem>
                  <SelectItem value="seo">SEO</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="contact">Contact</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                value={newSetting.order}
                onChange={(e) => setNewSetting(prev => ({ ...prev, order: Number(e.target.value) }))}
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {newSetting.type === 'select' && (
            <div className="space-y-2">
              <Label htmlFor="options">Options (comma-separated)</Label>
              <Input
                id="options"
                value={newSetting.options.join(', ')}
                onChange={(e) => setNewSetting(prev => ({ 
                  ...prev, 
                  options: e.target.value.split(',').map(opt => opt.trim()).filter(opt => opt) 
                }))}
                placeholder="Option 1, Option 2, Option 3"
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            {newSetting.type === 'text' ? (
              <Textarea
                id="value"
                value={newSetting.value as string}
                onChange={(e) => setNewSetting(prev => ({ ...prev, value: e.target.value }))}
                className="focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              />
            ) : newSetting.type === 'boolean' ? (
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newSetting.value as boolean}
                  onCheckedChange={(checked: boolean) => setNewSetting(prev => ({ ...prev, value: checked }))}
                />
                <Label>{newSetting.value ? 'Enabled' : 'Disabled'}</Label>
              </div>
            ) : newSetting.type === 'number' ? (
              <Input
                id="value"
                type="number"
                value={newSetting.value as number}
                onChange={(e) => setNewSetting(prev => ({ ...prev, value: Number(e.target.value) }))}
                className="focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <Input
                id="value"
                value={newSetting.value as string}
                onChange={(e) => setNewSetting(prev => ({ ...prev, value: e.target.value }))}
                className="focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Create Setting
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})

CreateSettingDialog.displayName = 'CreateSettingDialog'

// PERBAIKAN: Pisahkan komponen EditSettingDialog
const EditSettingDialog = React.memo(({
  open,
  onOpenChange,
  editingSetting,
  onUpdateSetting
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingSetting: Setting | null
  onUpdateSetting: (setting: Setting) => Promise<void>
}) => {
  const [formData, setFormData] = useState<Setting | null>(null)

  // Sync form data ketika editingSetting berubah
  useEffect(() => {
    if (editingSetting) {
      setFormData(editingSetting)
    }
  }, [editingSetting])

  const handleUpdate = async () => {
    if (formData) {
      await onUpdateSetting(formData)
      onOpenChange(false)
    }
  }

  if (!formData) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Edit Setting
          </DialogTitle>
          <DialogDescription>
            Modify the setting configuration.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-key">Key</Label>
              <Input
                id="edit-key"
                value={formData.key}
                onChange={(e) => setFormData(prev => prev ? { ...prev, key: e.target.value } : null)}
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: SettingType) => setFormData(prev => prev ? { ...prev, type: value } : null)}
              >
                <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-label">Label</Label>
            <Input
              id="edit-label"
              value={formData.label}
              onChange={(e) => setFormData(prev => prev ? { ...prev, label: e.target.value } : null)}
              className="focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => prev ? { ...prev, description: e.target.value } : null)}
              className="focus:ring-2 focus:ring-blue-500 min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value: SettingCategory) => setFormData(prev => prev ? { ...prev, category: value } : null)}
              >
                <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="appearance">Appearance</SelectItem>
                  <SelectItem value="seo">SEO</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="contact">Contact</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-order">Order</Label>
              <Input
                id="edit-order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData(prev => prev ? { ...prev, order: Number(e.target.value) } : null)}
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {formData.type === 'select' && (
            <div className="space-y-2">
              <Label htmlFor="edit-options">Options (comma-separated)</Label>
              <Input
                id="edit-options"
                value={formData.options?.join(', ') || ''}
                onChange={(e) => setFormData(prev => prev ? { 
                  ...prev, 
                  options: e.target.value.split(',').map(opt => opt.trim()).filter(opt => opt) 
                } : null)}
                placeholder="Option 1, Option 2, Option 3"
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Update Setting
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})

EditSettingDialog.displayName = 'EditSettingDialog'

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsType>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<SettingCategory>('general')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSetting, setEditingSetting] = useState<Setting | null>(null)
  const [createDialogCategory, setCreateDialogCategory] = useState<SettingCategory>('general')
  const [openConfirm, setOpenConfirm] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async (): Promise<void> => {
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]
      const response = await fetch('/api/admin/settings', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch settings')
      const data: SettingsType = await response.json()
      setSettings(data)
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (): Promise<void> => {
    setSaving(true)
    try {
      const updates: Record<string, string | number | boolean> = {}
      
      Object.keys(settings).forEach(key => {
        updates[key] = settings[key].value
      })

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]}`
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) throw new Error('Failed to save settings')

      toast.success('Settings saved successfully')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async (): Promise<void> => { 
    try {
      const response = await fetch('/api/admin/settings/seed', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]}`
        }
      })

      if (!response.ok) throw new Error('Failed to reset settings')

      await fetchSettings()
      toast.success('Settings reset to default')
    } catch (error) {
      console.error('Error resetting settings:', error)
      toast.error('Failed to reset settings')
    }
  }

  const handleCreateSetting = async (newSettingData: NewSettingForm): Promise<void> => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettingData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create setting')
      }

      await fetchSettings()
      toast.success('Setting created successfully')
    } catch (error: unknown) {
      console.error('Error creating setting:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create setting'
      toast.error(errorMessage)
    }
  }

  const handleUpdateSetting = async (setting: Setting): Promise<void> => {
    try {
      const response = await fetch(`/api/admin/settings/${setting.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]}`
        },
        body: JSON.stringify(setting),
      })

      if (!response.ok) throw new Error('Failed to update setting')

      await fetchSettings()
      toast.success('Setting updated successfully')
    } catch (error) {
      console.error('Error updating setting:', error)
      toast.error('Failed to update setting')
    }
  }

  const handleDeleteSetting = async (settingId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/admin/settings/${settingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]}`
        }
      })

      if (!response.ok) throw new Error('Failed to delete setting')

      await fetchSettings()
      toast.success('Setting deleted successfully')
    } catch (error) {
      console.error('Error deleting setting:', error)
      toast.error('Failed to delete setting')
    }
  }

  // PERBAIKAN: Gunakan useCallback untuk mencegah re-render
  const updateSetting = useCallback((key: string, value: string | number | boolean): void => {
    setSettings(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        value
      }
    }))
  }, [])

  const handleEditSetting = useCallback((setting: Setting): void => {
    setEditingSetting(setting)
    setIsEditDialogOpen(true)
  }, [])

  const handleOpenCreateDialog = useCallback((category: SettingCategory): void => {
    setCreateDialogCategory(category)
    setIsCreateDialogOpen(true)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 p-4 sm:p-6 lg:p-8">
        <ConfirmDialog
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        title="Reset Settings"
        description="Are you sure you want to reset all settings to default? This action cannot be undone."
        confirmText="Yes, Reset"
        cancelText="Cancel"
        onConfirm={handleReset}
      />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild className="rounded-full">
              <Link href="/dashboard">
                <ArrowLeftIcon className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 dark:from-gray-100 dark:to-blue-400 bg-clip-text text-transparent">
                Site Settings
              </h1>
              <p className="text-muted-foreground mt-1">
                Configure your website settings and preferences
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={() => setOpenConfirm(true)}
              className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
            >
              Reset to Default
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SettingCategory)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 px-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl ">
            {Object.entries(categoryColors).map(([category, colors]) => (
              <TabsTrigger 
                key={category}
                value={category} 
                className={`flex items-center gap-2 rounded-xl transition-all duration-300 ${colors.bg} ${colors.border} data-[state=active]:${colors.bg} data-[state=active]:border-2 data-[state=active]:shadow-lg`}
              >
                <div className={`p-1 rounded-lg ${colors.bg}`}>
                  {category === 'general' && <CogIcon className={`h-4 w-4 ${colors.icon}`} />}
                  {category === 'appearance' && <PaintBrushIcon className={`h-4 w-4 ${colors.icon}`} />}
                  {category === 'seo' && <ChartBarIcon className={`h-4 w-4 ${colors.icon}`} />}
                  {category === 'social' && <ShareIcon className={`h-4 w-4 ${colors.icon}`} />}
                  {category === 'contact' && <PhoneIcon className={`h-4 w-4 ${colors.icon}`} />}
                  {category === 'email' && <EnvelopeIcon className={`h-4 w-4 ${colors.icon}`} />}
                </div>
                <span className={`text-sm font-medium ${colors.text} capitalize`}>
                  {category}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.keys(categoryColors).map((category) => (
            <TabsContent key={category} value={category} className="space-y-6 animate-in fade-in-50 duration-300">
              <SettingCard
                category={category as SettingCategory}
                title={`${category.charAt(0).toUpperCase() + category.slice(1)} Settings`}
                description={`Configure ${category} related settings`}
                icon={
                  category === 'general' ? CogIcon :
                  category === 'appearance' ? PaintBrushIcon :
                  category === 'seo' ? ChartBarIcon :
                  category === 'social' ? ShareIcon :
                  category === 'contact' ? PhoneIcon :
                  EnvelopeIcon
                }
                settings={settings}
                onUpdateSetting={updateSetting}
                onEditSetting={handleEditSetting}
                onDeleteSetting={handleDeleteSetting}
                onCreateSetting={handleOpenCreateDialog}
              />
            </TabsContent>
          ))}
        </Tabs>

        {/* Create Setting Dialog */}
        <CreateSettingDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onCreateSetting={handleCreateSetting}
          initialCategory={createDialogCategory}
        />

        {/* Edit Setting Dialog */}
        <EditSettingDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          editingSetting={editingSetting}
          onUpdateSetting={handleUpdateSetting}
        />

        {/* Preview Card */}
        <Card className="mt-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 dark:from-gray-100 dark:to-blue-400 bg-clip-text text-transparent">
              <EyeIcon className="h-6 w-6" />
              Preview & Tools
            </CardTitle>
            <CardDescription className="text-lg">
              See how your changes will look and manage settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="outline" className="rounded-lg border-2 hover:scale-105 transition-transform">
                <Link href="/" target="_blank">
                  View Homepage
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-lg border-2 hover:scale-105 transition-transform">
                <Link href="/blog" target="_blank">
                  View Blog
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-lg border-2 hover:scale-105 transition-transform">
                <Link href="/projects" target="_blank">
                  View Projects
                </Link>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleOpenCreateDialog('general')}
                className="rounded-lg border-2 border-dashed hover:scale-105 transition-transform ml-auto bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Custom Setting
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}