'use server';

export async function verifyCredentials(role: 'admin' | 'president' | 'council', email: string, pass: string) {
    let expectedEmail = '';
    let expectedPass = '';
    let userName = '';

    // Simulate delay for security (prevent timing attacks) slightly
    await new Promise(resolve => setTimeout(resolve, 500));

    switch (role) {
        case 'admin':
            expectedEmail = process.env.ADMIN_EMAIL || '';
            expectedPass = process.env.ADMIN_PASSWORD || '';
            userName = 'Administrator';
            break;
        case 'president':
            expectedEmail = process.env.PRESIDENT_EMAIL || '';
            expectedPass = process.env.PRESIDENT_PASSWORD || '';
            userName = 'President Alex';
            break;
        case 'council':
            expectedEmail = process.env.COUNCIL_EMAIL || '';
            expectedPass = process.env.COUNCIL_PASSWORD || '';
            userName = 'Council Member';
            break;
    }

    if (!expectedEmail || !expectedPass) {
        console.error(`Missing environment variables for role: ${role}`);
        return { success: false, message: 'Server configuration error.' };
    }

    // Basic Comparison (In production, passwords should be hashed)
    // For this request, we are matching against .env strings directly
    if (email.toLowerCase() === expectedEmail.toLowerCase() && pass === expectedPass) {
        return { success: true, userRole: role, userName };
    }

    return { success: false, message: 'Invalid credentials.' };
}

export async function universalLogin(email: string, pass: string) {
    // Check Admin
    if (process.env.ADMIN_EMAIL &&
        email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase() &&
        pass === process.env.ADMIN_PASSWORD) {
        return { success: true, role: 'admin', userName: 'Administrator' };
    }

    // Check President
    if (process.env.PRESIDENT_EMAIL &&
        email.toLowerCase() === process.env.PRESIDENT_EMAIL.toLowerCase() &&
        pass === process.env.PRESIDENT_PASSWORD) {
        return { success: true, role: 'president', userName: 'President Alex' };
    }

    // Check Council
    if (process.env.COUNCIL_EMAIL &&
        email.toLowerCase() === process.env.COUNCIL_EMAIL.toLowerCase() &&
        pass === process.env.COUNCIL_PASSWORD) {
        return { success: true, role: 'council', userName: 'Council Member' };
    }

    return { success: false };
}
