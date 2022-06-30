import { SchemaOptions } from 'mongoose'

export const OPTIONS: SchemaOptions = {
  toJSON: {
    transform: (_, doc) => {
      const { _id, ...rest } = doc
      return { id: _id, ...rest }
    },
    versionKey: false,
  },
}

export const enum COLLECTION_NAMES {
  TAG = 'tags',
}
