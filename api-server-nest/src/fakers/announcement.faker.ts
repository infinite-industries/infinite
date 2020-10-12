import faker from 'faker'

function announcement(): unknown {
  return {
    message: faker.lorem.paragraph()
  }
}

export default announcement
