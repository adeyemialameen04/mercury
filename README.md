# Mercury
##### Use light mode for better experience 

Mercury is a mobile trading application built with Expo React Native for the Stacks (STX) blockchain ecosystem. It provides essential wallet management and token transaction features in a user-friendly interface.

## Features

### Wallet Management

- **Wallet Generation**: Create new secure STX wallets within the app
- **Wallet Import**: Import existing wallets using standard recovery methods
- **Multi-wallet Support**: Manage multiple STX wallets in one place
- **QRCODE**: Get a qrcode for your address and feature to scan others qrcodes to send them tokens/stx.

### Token Operations

- **Token Details**: View comprehensive information about your tokens including:
  - Current balance
  - Token metadata
  - Price information in USD(options to change is coming soon)
- **Token Transfers**: Send tokens to other addresses with ease
- **Transaction History**: Track all token-related transactions with detailed information
- **Buy token directly from DEXES**: Ability to buy tokens in stx.city if its listed there

## Getting Started

### Prerequisites

- Node.js (14.0 or higher) (bun)
- Expo CLI
- Android Emulator for development

### Installation

1. Clone the repository

```bash
git clone https://github.com/adeyemialameen04/mercury
cd mercury
```

2. Install dependencies

```bash
bun install
```

3. Prebuild

```bash
bun preb
```

4. Start the development server

```bash
bun dev:android
```

## Development Stack

- **Framework**: Expo React Native
- **Blockchain**: Stacks (STX)
- **State Management**: [react-native-mmkv]
- **UI Components**: [react-native-reusables, nativewind]

## Roadmap

- [ ] Implement Token Snipping feature.
- [ ] Get notifications on new tokens launch.
- [ ] Implement token swapping functionality
- [ ] Add support for NFTs
- [ ] Integrate with popular DEXes

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Contact

