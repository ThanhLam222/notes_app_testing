import { faker } from '@faker-js/faker/locale/en';

export function createNote(overrides = {}) {
    return {
        title: overrides.title ?? faker.lorem.sentence(5),
        description: overrides.description ?? faker.lorem.paragraph(4),
    }
}
