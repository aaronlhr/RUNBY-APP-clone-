# 🗄️ RUNBY Database Schema

## Users Table
- id (UUID, Primary Key)
- clerk_user_id (Text, Unique)
- email (Text, Unique)
- running preferences (pace, distance, times)
- verification status
- subscription tier
- location data

## Matches Table
- Match relationships between users
- Status tracking
- Timestamps

## Messages Table
- Real-time chat system
- Message types and status
- Read receipts

## Premium Features
- Subscription tracking
- Feature access control
