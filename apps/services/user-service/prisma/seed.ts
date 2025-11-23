import { PrismaClient } from '@connectify/auth-db';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding User Service...');

    // Mock password hash
    const passwordHash = await bcrypt.hash('password123', 10);

    // 1. Create Alice
    await prisma.users.upsert({
        where: { id: 'user-alice' }, // Hardcoded ID to match other services
        update: {},
        create: {
            id: 'user-alice',
            email: 'alice@tii.edu',
            username: 'alice_dev',
            password: passwordHash,
            name: 'Alice Johnson',
            profileImageUrl: faker.image.avatar(),
            isEmailVerified: true,
            universityId: 'univ-123', // Matches Community Service
        },
    });

    // 2. Create Bob
    await prisma.users.upsert({
        where: { id: 'user-bob' },
        update: {},
        create: {
            id: 'user-bob',
            email: 'bob@tii.edu',
            username: 'bob_designer',
            password: passwordHash,
            name: 'Bob Smith',
            profileImageUrl: faker.image.avatar(),
            isEmailVerified: true,
            universityId: 'univ-123',
        },
    });

    console.log('✅ User Service Seeded');
}

main()
    .then(async () => { await prisma.$disconnect(); })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });