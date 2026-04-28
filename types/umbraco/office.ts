import { z } from 'zod'

export const DayOfWeekSchema = z.enum([
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
])
export type DayOfWeek = z.infer<typeof DayOfWeekSchema>

export const DayHoursSchema = z.object({
  open: z.string().nullable(),
  close: z.string().nullable(),
  isClosed: z.boolean(),
})
export type DayHours = z.infer<typeof DayHoursSchema>

export const OfficeStatusSchema = z.object({
  isOpen: z.boolean(),
  statusText: z.string(),
  timeUntilChange: z.string().nullable(),
  nextChangeDay: z.string().nullable(),
})
export type OfficeStatus = z.infer<typeof OfficeStatusSchema>

export const DailyScheduleSchema = z.object({
  date: z.string(),
  dayOfWeek: z.string(),
  open: z.string().nullable(),
  close: z.string().nullable(),
  isClosed: z.boolean(),
  isOverride: z.boolean(),
  overrideLabel: z.string().nullable(),
})
export type DailySchedule = z.infer<typeof DailyScheduleSchema>

export const RegularHoursSchema = z.record(z.string(), DayHoursSchema)
export type RegularHours = z.infer<typeof RegularHoursSchema>

export const OfficeListItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  label: z.string(),
  city: z.string(),
  country: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  distanceMeters: z.number().nullable(),
  status: OfficeStatusSchema,
})
export type OfficeListItem = z.infer<typeof OfficeListItemSchema>

export const OfficesListResponseSchema = z.object({
  countries: z.array(z.string()),
  offices: z.array(OfficeListItemSchema),
})
export type OfficesListResponse = z.infer<typeof OfficesListResponseSchema>

export const OfficeDetailSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  label: z.string(),
  city: z.string(),
  country: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  distanceMeters: z.number().nullable(),
  timezone: z.string(),
  status: OfficeStatusSchema,
  regularHours: RegularHoursSchema,
  schedule: z.array(DailyScheduleSchema),
})
export type OfficeDetail = z.infer<typeof OfficeDetailSchema>

export const OfficeHoursResponseSchema = z.object({
  officeId: z.string().uuid(),
  timezone: z.string(),
  regularHours: RegularHoursSchema,
  schedule: z.array(DailyScheduleSchema),
})
export type OfficeHoursResponse = z.infer<typeof OfficeHoursResponseSchema>
