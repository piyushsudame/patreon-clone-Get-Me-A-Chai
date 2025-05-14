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
      authorization: {
        params: {
          scope: 'read:user user:email'
        }
      },
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        }
      }
    }),
    
    // Google provider
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
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
        console.log("Sign in callback", { 
          provider: account?.provider, 
          email: user?.email,
          name: user?.name,
          profile_email: profile?.email
        });
        
        // If user doesn't have an email but profile does, use that
        if (user && !user.email && profile && profile.email) {
          console.log("Using email from profile:", profile.email);
          user.email = profile.email;
        }
        
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
              // Ensure email is not null or empty
              if (!user.email) {
                console.error("Cannot create user: Email is null or empty");
                // Continue with authentication but log the error
              } else {
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
                  console.log("New user created successfully in NextAuth:", user.email);
                } catch (saveError) {
                  console.error("Error saving new user in NextAuth:", saveError);
                  // Continue with authentication even if user creation fails
                  // The get-user and update-user APIs will handle this case
                }
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
      if (token && token.email) {
        if (!session.user) {
          session.user = {};
        }
        session.user.email = token.email;
      }
      
      console.log("Session callback", { 
        session_email: session?.user?.email,
        token_email: token?.email
      });
      
      return session;
    },
    async jwt({ token, user, account, profile }) {
      // Add user info to the token
      if (user) {
        token.id = user.id;
        
        // Ensure email is in the token
        if (user.email) {
          token.email = user.email;
        } else if (profile && profile.email) {
          token.email = profile.email;
        }
      }
      
      console.log("JWT callback", { 
        token_email: token?.email,
        user_email: user?.email,
        profile_email: profile?.email
      });
      
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