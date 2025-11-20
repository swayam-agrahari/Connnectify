import prisma from '../src/generated/index'; // 👈 Your custom path
import { faker } from '@faker-js/faker';

async function main() {
    console.log('🌱 Seeding Community Service...');

    // 1. Create University
    const university = await prisma.university.upsert({
        where: { id: 'univ-123' }, // Hardcoded ID
        update: {},
        create: {
            id: 'univ-123',
            name: 'Tech Institute of Innovation',
            emailDomain: 'tii.edu',
            logoImageUrl: faker.image.url(),
        },
    });

    // 2. Create Communities
    await prisma.community.upsert({
        where: { id: 'comm-tech' },
        update: {},
        create: {
            id: 'comm-tech',
            name: 'Computer Science',
            description: 'For all things CS and coding.',
            universityId: university.id,
            creator: 'user-alice', // referencing a user we will create later
        },
    });

    await prisma.community.upsert({
        where: { id: 'comm-art' },
        update: {},
        create: {
            id: 'comm-art',
            name: 'Digital Arts',
            description: 'Design, UI/UX and painting.',
            universityId: university.id,
            creator: 'user-bob',
        },
    });

    console.log('✅ Community Service Seeded');
}

main()
    .then(async () => { await prisma.$disconnect(); })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });