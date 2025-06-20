
/* !!! This is code generated by Prisma. Do not edit directly. !!! */
/* eslint-disable */
// @ts-nocheck 
/**
* This file exports all enum related types from the schema.
*
* 🟢 You can import this file directly.
*/
export const StatusGroup = {
  PLAYING: 'PLAYING',
  BACKLOG: 'BACKLOG',
  FINISHED: 'FINISHED',
  PLANNED: 'PLANNED',
  DROPPED: 'DROPPED'
} as const

export type StatusGroup = (typeof StatusGroup)[keyof typeof StatusGroup]


export const Theme = {
  SYSTEM: 'SYSTEM',
  DARK: 'DARK',
  LIGHT: 'LIGHT'
} as const

export type Theme = (typeof Theme)[keyof typeof Theme]


export const View = {
  GRID: 'GRID',
  LIST: 'LIST'
} as const

export type View = (typeof View)[keyof typeof View]


export const GamesPerPage = {
  GPP5: 'GPP5',
  GPP20: 'GPP20',
  GPP50: 'GPP50',
  GPP100: 'GPP100'
} as const

export type GamesPerPage = (typeof GamesPerPage)[keyof typeof GamesPerPage]
