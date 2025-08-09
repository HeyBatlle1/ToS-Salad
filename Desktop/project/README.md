# Legacy App - Dead Man's Switch for Family Messages

A secure, encrypted dead man's switch application that allows family members to leave important messages, confessions, or final words that are automatically delivered to designated recipients if they don't check in for a specified period.

## 🔒 How It Works

1. **Create Encrypted Messages**: Users write confessions or important messages that are encrypted client-side
2. **Set Recipients**: Designate family members or trusted contacts to receive messages
3. **Heartbeat System**: Regular check-ins reset the timer
4. **Automatic Trigger**: If no heartbeat is detected within the specified timeframe, encrypted messages are sent to recipients
5. **Secure Decryption**: Recipients receive unique decryption keys to access their messages

## 🚀 Features

- **End-to-End Encryption**: Messages are encrypted client-side using AES-GCM encryption
- **Magic Link Authentication**: Secure, passwordless login via Supabase
- **Configurable Timer**: Set custom inactivity periods (default: 30 days)
- **Multiple Recipients**: Send different messages to different family members
- **Heartbeat Monitoring**: Simple "I'm alive" check-in system
- **Manual Testing**: Test the system without waiting for the timer
- **Secure Key Management**: Each recipient gets their own decryption key

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** with TypeScript
- **React 18** for UI components
- **Tailwind CSS** for styling
- **Web Crypto API** for client-side encryption

### Backend & Database
- **Supabase** (PostgreSQL) with Row Level Security
- **Supabase Auth** for magic link authentication
- **Edge Functions** for automated triggers

### Deployment
- **Vercel** for hosting
- **Supabase** for database and authentication

## 📁 Project Structure

```
├── legacy-app/                 # Main Next.js application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.tsx      # Main dashboard
│   │   │   ├── recipient/     # Message viewing for recipients
│   │   │   └── api/           # API endpoints
│   │   └── lib/
│   │       └── supabase.ts    # Supabase client
│   ├── supabase/
│   │   └── migrations/        # Database schema
│   └── scripts/               # Utility scripts
├── lib/                       # Shared libraries
├── src/                       # Additional components
└── supabase/                  # Main Supabase configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   ```

2. **Install dependencies**
   ```bash
   cd legacy-app
   npm install
   ```

3. **Environment Setup**
   
   Create `.env.local` in the `legacy-app` directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Database Setup**
   
   Run the Supabase migrations:
   ```bash
   cd legacy-app
   npx supabase db reset
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📊 Database Schema

### Core Tables

- **`confessions`**: Encrypted user messages with metadata
- **`recipients`**: Designated message recipients with decryption keys
- **`heartbeats`**: User activity tracking for dead man's switch
- **`profiles`**: User profile information

### Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Client-side encryption** using Web Crypto API
- **Unique decryption keys** per recipient
- **Secure key storage** in database

## 🔐 Security & Privacy

### Encryption Details
- **Algorithm**: AES-GCM with 256-bit keys
- **Key Generation**: Cryptographically secure random keys
- **Initialization Vectors**: Unique IV per message
- **Client-Side Only**: Encryption/decryption happens in the browser

### Privacy Protection
- Messages are encrypted before leaving the user's device
- Supabase only stores encrypted data
- Decryption keys are only accessible to designated recipients
- No plaintext messages are ever stored on servers

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   cd legacy-app
   npx vercel
   ```

2. **Configure Environment Variables**
   Add all environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

3. **Deploy**
   ```bash
   npx vercel --prod
   ```

### Build Configuration
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## 🧪 Testing

### Manual Testing
1. Create a confession with recipients
2. Use the "Manual Trigger" button to test delivery
3. Check recipient URLs in console logs
4. Verify decryption works for recipients

### Heartbeat Testing
1. Set a short trigger period (e.g., 1 day)
2. Don't check in for the specified period
3. Verify automatic triggering works

## 📝 API Endpoints

- `POST /api/check-triggers` - Manual trigger for testing
- `GET /recipient/[id]` - Recipient message viewing page

## 🔄 How the Dead Man's Switch Works

1. **User Setup**: User creates encrypted confessions and sets recipients
2. **Heartbeat Tracking**: System tracks last user activity
3. **Automated Monitoring**: Background process checks for inactive users
4. **Trigger Condition**: If user hasn't checked in within specified timeframe
5. **Message Delivery**: Recipients receive access to their designated messages
6. **Secure Access**: Recipients use unique URLs with decryption keys

## ⚠️ Important Considerations

### Legal & Ethical
- **Family Use Only**: Designed for family communication and final messages
- **Privacy Respect**: Only designated recipients can access messages
- **Data Sensitivity**: Handle personal confessions with appropriate care

### Technical
- **Backup Strategy**: Consider multiple recipients for important messages
- **Key Management**: Lost decryption keys mean lost messages
- **Browser Compatibility**: Requires modern browsers with Web Crypto API support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and intended for family use only.

## 🆘 Support

For technical issues:
- Create an issue in this repository
- Check the console logs for debugging information

## 🙏 Use Cases

- **Final Messages**: Leave important words for family members
- **Family Secrets**: Share family history or important information
- **Emergency Instructions**: Provide access to important accounts or documents
- **Personal Confessions**: Share personal thoughts or apologies
- **Legacy Planning**: Ensure important information reaches the right people

---

**Remember: This is a tool for family communication and should be used responsibly. Always consider the emotional impact of your messages on recipients.**
