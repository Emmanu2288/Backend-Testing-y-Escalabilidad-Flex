import { faker } from '@faker-js/faker'
import { USER_ROLES } from '../constants/index.js'

export const generateMockUser = () => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const randomSuffix = faker.number.int({ min: 1000, max: 999999 })
  const password = faker.internet.password({ length: 8, memorable: true, pattern: /[A-Za-z0-9]/ })

  return {
    name: `${firstName} ${lastName}`,
    email: `${firstName}.${lastName}${randomSuffix}@test.com`.toLowerCase(),
    password: password,
    role: USER_ROLES.CUSTOMER
  }
}