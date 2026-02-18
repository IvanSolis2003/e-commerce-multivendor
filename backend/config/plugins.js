module.exports = ({ env }) => ({
    'users-permissions': {
        config: {
            jwtSecret: env('JWT_SECRET') || env('ADMIN_JWT_SECRET') || 'your-default-secret-key-CHANGE-ME',
        },
    },
});
