'use server'

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function createCommunity(data: {
    name: string;
    description: string;
    universityId: string;
    creator: string;
}) {
    try {
        const cookieStore = await cookies();
        const tokenObj = cookieStore.get("session");
        const uidObj = cookieStore.get("uid");

        const token = tokenObj?.value;
        const uid = uidObj?.value;
        if (!token || !uid) {
            throw new Error("no token or uni id")
        }
        const response = await fetch(`http://localhost:3002/api/community/create`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Cookie": `session=${token}; uid=${uid}`,
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            return { success: false, error: error.message || 'Failed to create community' };
        }

        const community = await response.json();
        revalidatePath('/communities');
        return { success: true, data: community };
    } catch (error) {
        return { success: false, error: 'Network error. Please try again.' };
    }
}