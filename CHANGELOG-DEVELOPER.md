# Eurofurence App - Developer Changelog

## Technical Changes (Since December 2023)

### 🏗️ **Architecture & Dependencies**

#### Package Management & Updates
- **Expo Audio Migration** (`212b056`): Migrated from legacy audio to `expo-audio` package
- **Package Updates** (`5e5b249`, `212b056`): Updated various dependencies for security and compatibility
- **Import Cleanup** (`4d7ffa0`): Organized and cleaned up import statements across codebase

#### App Configuration
- **Version Management** (`b071e1b`): Fixed app version handling and reverted problematic changes
- **iOS Configuration** (`0a614ea`): Set appropriate default iOS settings
- **Safe Area Handling** (`fcfe208`): Improved safe area implementation across components

### 🗺️ **Maps & Navigation**

#### EFNav Integration (`fcfe208`, `fa51bbc`)
- Added EFNav support to dealers and events components
- Implemented `LinkPreview` component for enhanced map link handling
- Added Open Graph metadata extraction utility (`extractOgMeta.ts`)
- Removed legacy `ImageButton` component in favor of new implementation
- Updated map selectors and removed deprecated functionality

#### Map System Overhaul
- Replaced legacy map components with modern implementations
- Enhanced dealer and event content components with map integration
- Added new API types for map functionality

### 🛠️ **Component Improvements**

#### UI Component Updates (`fcfe208`, `9c6dfe6`)
- **Pressable Migration**: Updated from TouchableOpacity to Pressable components for better performance
- **Header Component**: Refactored Header component for better layout and functionality
- **Tab System**: Fixed issues with top tabs not displaying correctly (`ddefee2`)
- **Accessibility**: Added accessibility properties to buttons (`36bb789`)

#### Layout & Navigation (`fcfe208`)
- Updated app layout structure in `_layout.tsx` files
- Improved dealers and schedule layout components
- Enhanced main menu component with cleaner implementation

### 🐛 **Bug Fixes & Error Handling**

#### Content Availability (`9a0ef3c`)
- **Announcement Error Handling**: Fixed blank page issue when announcements don't exist
- Added comprehensive error states for missing content
- Implemented fallback messages for expired or deleted content
- Added test coverage for announcement error scenarios

#### Technical Bug Fixes
- **Regex Fix** (`eb5b6f7`): Fixed regex match group issues
- **TanStack Query** (`df6f008`): Updated to use TanStack Query for better data fetching
- **Artists Alley Fixes** (`b155473`, `04d3ba8`): Multiple fixes for Artists Alley functionality
- **Lint Issues** (`52ce869`): Resolved various ESLint warnings and errors

### 🌐 **Internationalization**

#### Translation System (`multiple commits`)
- Added missing translation keys across all supported languages
- Enhanced translation coverage for new features
- Updated German, English, Italian, Dutch, and Polish translations
- Added fallback text for untranslated content

### 🧪 **Testing & Quality**

#### Test Coverage (`9a0ef3c`)
- Added comprehensive test suite for `AnnounceItem` component
- Removed outdated example tests
- Implemented test cases for error handling scenarios

#### Code Quality
- Enhanced ESLint configuration and fixed violations
- Improved import organization and code structure
- Added better error handling and logging

### 📝 **Configuration & Tooling**

#### Build & Development
- Updated app configuration for new package dependencies
- Enhanced build process for expo-audio integration
- Improved development tooling and linting setup

### 🔄 **API & Data Management**

#### Data Types (`fa51bbc`)
- Added new API type definitions for enhanced functionality
- Updated context data types for map integration
- Enhanced data flow for dealers and events

---

## Commit Reference

Key commits by category:

**Features:**
- `fcfe208` - Maps replacement & UI improvements
- `fa51bbc` - EFNav integration for dealers & events
- `cdbb306` - New credits system

**Bug Fixes:**
- `9a0ef3c` - Announcement error handling
- `ddefee2` - Tab display issues
- `eb5b6f7` - Regex fixes
- `b155473` - Artists Alley improvements

**Maintenance:**
- `212b056` - Package updates & expo-audio migration
- `5e5b249` - Dependency updates
- `4d7ffa0` - Import cleanup
- `52ce869` - Lint fixes

**Translations:**
- `04d3ba8` - Translation additions & error fixes
- `cfaf312` - Missing translation additions
- `2e794e6` - Translation updates

---

*For user-facing changes, see CHANGELOG-USER.md*