# Teia Gallery

A modern, responsive NFT gallery application built with Next.js that showcases digital art from the Tezos blockchain. The gallery provides multiple viewing modes and seamless pagination for an optimal user experience.

🌐 **Live Site**: [https://www.hicetnunc.wiki/](https://www.hicetnunc.wiki/)

## 📊 Data Source

The application fetches NFT data from the Tezos blockchain via:

- **GraphQL API**: `https://data.objkt.com/v3/graphql`
- **IPFS Integration**: Images and metadata served from IPFS
- **Real-time Updates**: Live data from the blockchain

## 🎨 Features

### **Multiple Viewing Modes**

- **Random View**: Displays NFTs in a shuffled, randomized order for discovery
- **Sorted View**: Shows NFTs organized by listing date (newest first)
- **Your Own View**: Allows users to search and view NFTs by wallet address

### **Optimized Performance**

- **Image Optimization**: Next.js Image component with WebP/AVIF support
- **Lazy Loading**: Images load as users scroll for faster initial page loads
- **Memoization**: React.memo and useMemo for optimal re-rendering
- **Code Splitting**: Efficient bundle splitting for better performance

### **User Experience**

- **Smooth Pagination**: Arrow-based navigation with scroll-to-top functionality
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile
- **Error Handling**: Graceful fallbacks for failed image loads
- **Loading States**: Skeleton loaders and smooth transitions

## 🛠️ Technology Stack

- **Framework**: Next.js 15.1.6
- **React**: 18.3.1
- **Styling**: Material-UI 6.1.6
- **Data Fetching**: Apollo Client 3.12.9
- **Animation**: Framer Motion 11.15.0
- **Language**: TypeScript 5.7.2

## 🎯 Key Components

### **OptimizedImage**

Handles image loading with:

- Automatic format optimization (WebP/AVIF)
- Lazy loading and skeleton states
- Error handling and fallbacks
- Support for animated GIFs and video previews

### **View Modes**

#### Random View

- Fetches large dataset (1000 NFTs) once
- Client-side shuffling for consistent pagination
- Maintains random order when navigating between pages

#### Sorted View

- Server-side pagination by listing date
- Real-time data fetching per page
- Chronological organization (newest first)

#### Your Own View

- Wallet address search functionality
- Dynamic pagination based on user's NFT count
- URL parameter support for direct linking

## 🔧 Configuration

### **Next.js Config** (`next.config.js`)

- Image optimization settings
- IPFS domain configuration
- Package import optimization
- Security policies for SVG handling

### **Apollo Client Setup**

- HTTP link to Tezos GraphQL API
- Cache policies for optimal data handling
- Error handling and retry logic

## 🔍 Search & Filtering

- **Address Search**: Find NFTs by wallet address
- **Content Filtering**: Excludes unwanted creators/names
- **Real-time Results**: Instant search feedback

## 🔗 Links

- **Live Site**: [https://www.hicetnunc.wiki/](https://www.hicetnunc.wiki/)
- **Tezos Blockchain**: [https://tezos.com/](https://tezos.com/)
- **IPFS**: [https://ipfs.io/](https://ipfs.io/)
