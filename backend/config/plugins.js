module.exports = ({ env }) => {
    const jwtSecret = env('JWT_SECRET');
    console.log('--- STRAPI PLUGINS LOADER ---');
    console.log('JWT_SECRET present:', !!jwtSecret);
    console.log('ALL ENV KEYS:', Object.keys(process.env).filter(k => k.includes('JWT') || k.includes('SECRET')));

    return {
        'users-permissions': {
            config: {
                jwtSecret: jwtSecret || 'fallback-secret-for-debugging-only',
            },
        },
    };
};
