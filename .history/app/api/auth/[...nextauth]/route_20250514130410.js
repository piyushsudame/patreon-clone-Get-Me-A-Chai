import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import mongoose from 'mongoose';
import User from '@/models/user';
import Payment from '@/models/Payment';


export const authOptions = {
  // Configure one or more authentication providers
  useSecureCookies: true, // Always use secure cookies with HTTPS URLs
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true, // Always use secure cookies with HTTPS URLs
      },
    },
  },
  providers: [
    // GitHub provider
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    
    // Google provider
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
      httpOptions: {
        timeout: 10000 // Increase timeout to 10 seconds
      }
    }),
    
    
    // Add a fallback credentials provider for development
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // This is a simple example, replace with your actual authentication logic
        if (credentials.username === "user" && credentials.password === "password") {
          return { id: "1", name: "Test User", email: "test@example.com" }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login'
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        console.log("Sign in callback", { provider: account?.provider, email: user?.email });
        
        // Check if account is defined before accessing its properties
        if(account && (account.provider === "github" || account.provider === "google") && user && user.email) {
          try {
            // Connect to MongoDB using your connection string
            const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/get-me-a-chai";
            
            // Only attempt to connect if not already connected
            if (mongoose.connection.readyState !== 1) {
              try {
                await mongoose.connect(MONGODB_URI, {
                  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
                  socketTimeoutMS: 45000, // Close sockets after 45s
                });
                console.log("MongoDB connected successfully in NextAuth");
              } catch (mongoError) {
                console.error("MongoDB connection error in NextAuth:", mongoError);
                // Continue with authentication even if MongoDB connection fails
              }
            }
            
            // Check if user already exists
            const currentUser = await User.findOne({ email: user.email });
            // Check if user exists in database
            
            if(!currentUser) {
              try {
                // Create a new user with the required fields
                const newUser = new User({
                  name: user.name || (account.provider === 'github' ? 'GitHub User' : 'Google User'),
                  email: user.email,
                  username: user.name?.replace(/\s+/g, '-').toLowerCase() || `user-${Date.now()}`,
                  profilepic: user.image || '',
                  coverpic: ''
                });
                await newUser.save();
                console.log("New user created successfully:", user.email);
              } catch (saveError) {
                console.error("Error saving new user:", saveError);
                // Continue with authentication even if user creation fails
                // The get-user and update-user APIs will handle this case
              }
            }
          } catch (dbError) {
            // Log database error but still allow sign-in
            console.error("Database error during sign in:", dbError);
            // We'll still return true to allow sign-in even if DB operations fail
          }
        }
        
        // Always allow sign-in, even if there were database issues
        return true;
      } catch (error) {
        console.error("Critical error during sign in:", error);
        // Only deny sign-in for critical errors
        return false;
      }
    },
    async session({ session, token }) {
      // Add user info to the session
      return session;
    },
    async jwt({ token, user, account, profile }) {
      // Add user info to the token
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development'
}

// Create the handler with the authOptions
const handler = NextAuth(authOptions)

// Export the handler for the GET and POST methods
export { handler as GET, handler as POST }