// import { Inject } from '@nestjs/common/decorators'
// import { ResponseMapper } from '../mappers'

// TODO implement this
export function InjectResponseMapper<T>(response: T) {
  throw new Error('this should be a decorator for' + response)

  // return Inject(new ResponseMapper(response))
  // return (target: object, key: string | symbol, index?: number) => {
  //   if (index !== undefined) {
  //     const type = new ResponseMapper(response)
  //     const dependencies = Reflect.getMetadata('design:paramtypes', target) || []
  //     dependencies[index] = type

  //     console.log({ dependencies, type })

  //     Reflect.defineMetadata('design:paramtypes', dependencies, target)
  //   }
  // }
}
