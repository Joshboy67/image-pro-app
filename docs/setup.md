# Project Setup Guide

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Git
- Supabase account
- Google OAuth credentials
- Sentry account (optional)

## Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/image-pro.git
   cd image-pro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment variables file:
   ```bash
   cp .env.example .env.local
   ```

4. Configure environment variables:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # Sentry (optional)
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
   ```

## Database Setup

1. Create a new Supabase project

2. Run database migrations:
   ```bash
   npm run db:migrate
   ```

3. Enable required extensions:
   ```sql
   create extension if not exists "uuid-ossp";
   create extension if not exists "pgcrypto";
   ```

4. Create storage bucket:
   ```sql
   insert into storage.buckets (id, name, public)
   values ('avatars', 'avatars', true);
   ```

## Google OAuth Setup

1. Go to Google Cloud Console
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   ```
   http://localhost:3000/auth/callback
   https://yourdomain.com/auth/callback
   ```

## Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Run tests:
   ```bash
   npm test
   ```

3. Run linting:
   ```bash
   npm run lint
   ```

## Testing Setup

1. Install test dependencies:
   ```bash
   npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
   ```

2. Configure Jest:
   ```javascript
   // jest.config.js
   module.exports = {
     testEnvironment: 'jsdom',
     setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
     moduleNameMapper: {
       '^@/(.*)$': '<rootDir>/src/$1',
     },
   };
   ```

3. Create test setup file:
   ```javascript
   // jest.setup.js
   import '@testing-library/jest-dom';
   ```

## Monitoring Setup (Optional)

1. Create Sentry project
2. Install Sentry dependencies:
   ```bash
   npm install @sentry/nextjs
   ```

3. Initialize Sentry:
   ```bash
   npx @sentry/nextjs init
   ```

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

## Common Issues

### Database Connection

If you encounter database connection issues:
1. Verify Supabase credentials
2. Check network connectivity
3. Ensure database is running

### OAuth Issues

If Google OAuth is not working:
1. Verify client ID and secret
2. Check redirect URIs
3. Ensure Google+ API is enabled

### Storage Issues

If file uploads fail:
1. Verify storage bucket exists
2. Check storage policies
3. Ensure file size limits are configured

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use secure values in production
   - Rotate keys regularly

2. **Database**
   - Enable RLS policies
   - Use prepared statements
   - Regular backups

3. **File Uploads**
   - Validate file types
   - Implement size limits
   - Scan for malware

4. **Authentication**
   - Use secure session management
   - Implement rate limiting
   - Regular security audits

## Performance Optimization

1. **Frontend**
   - Enable code splitting
   - Optimize images
   - Implement caching

2. **Backend**
   - Use connection pooling
   - Implement caching
   - Optimize queries

3. **Storage**
   - Use CDN
   - Implement caching
   - Optimize file sizes

## Maintenance

1. **Regular Tasks**
   - Update dependencies
   - Run security audits
   - Monitor performance
   - Backup database

2. **Monitoring**
   - Check error logs
   - Monitor performance
   - Track user metrics

## Support

For support:
1. Check documentation
2. Review common issues
3. Contact development team
4. Submit bug reports

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Run tests
5. Submit pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 