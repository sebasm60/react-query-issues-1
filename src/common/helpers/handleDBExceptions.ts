import { BadRequestException, InternalServerErrorException, Logger } from "@nestjs/common"

export const handleDBExceptions = (error: any, loggerName: string): never => {
  const logger = new Logger(loggerName)
  if (error.code === 'EREQUEST') throw new BadRequestException(error.originalError.message)
  logger.error(error)
  throw new InternalServerErrorException('Unexpected error, check server logs')
}