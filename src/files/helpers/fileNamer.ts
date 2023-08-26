import { Request } from 'express'
import { v4 as uuid } from 'uuid'

export const fileNamer = (req: Request, file: Express.Multer.File, callBack: Function) => {

  if (!file) return callBack(new Error('File is empty'), false)

  const fileExtension = file.mimetype.split('/')[1]

  const fileName: string = `${uuid()}.${fileExtension}`

  return callBack('', fileName)
}