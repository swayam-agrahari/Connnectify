import { PrismaClient } from '@connectify/post-db';
import { PostType, VoteType } from '@connectify/post-db/client'
import { faker } from '@faker-js/faker';


const prisma = new PrismaClient();
async function main() {
    console.log('🌱 Seeding Post Service...');

    // 1. Create a Text Post (by Alice in CS Community)
    const textPost = await prisma.post.create({
        data: {
            type: PostType.TEXT,
            content: 'Has anyone started the Algorithms assignment?',
            tags: ['algo', 'help', 'cs101'],
            authorId: 'user-alice', // Reference to Alice
            communityId: 'comm-tech', // Reference to CS Community
            universityId: "9",
            votes: {
                create: [
                    { type: VoteType.UPVOTE, userId: 'user-bob' } // Bob upvoted
                ]
            },
            comments: {
                create: {
                    text: 'Yes, it is super hard!',
                    authorId: 'user-bob', // Bob commented
                }
            }
        },
    });

    // 2. Create an Image Post (by Bob in Art Community)
    await prisma.post.create({
        data: {
            type: PostType.IMAGE,
            content: 'Check out my new UI design',
            imageUrl: faker.image.url(),
            tags: ['design', 'ui', 'figma'],
            authorId: 'user-bob',
            communityId: 'comm-art',
            universityId: "9",
        },
    });

    // 3. Create a Poll (by Alice)
    const poll = await prisma.post.create({
        data: {
            type: PostType.POLL,
            content: 'Which framework is better?',
            tags: ['react', 'vue', 'debate'],
            authorId: 'user-alice',
            communityId: 'comm-tech',
            universityId: "9",
            pollOptions: {
                create: [
                    { text: 'React' },
                    { text: 'Vue' },
                    { text: 'Svelte' } // ID will be auto-generated, e.g. poll-opt-1
                ]
            }
        },
        include: { pollOptions: true } // Include so we can vote on them below
    });

    // 4. Add Votes to the Poll
    // Bob votes for the first option (React)
    if (poll.pollOptions && poll.pollOptions.length > 0) {
        await prisma.pollVote.create({
            data: {
                userId: 'user-bob',
                postId: poll.id,
                pollOptionId: poll.pollOptions[0]!.id,
            }
        });
    }

    console.log('✅ Post Service Seeded');
}

main()
    .then(async () => { await prisma.$disconnect(); })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });