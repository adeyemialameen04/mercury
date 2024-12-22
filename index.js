import { registerRootComponent } from 'expo';
import "./polyfill";
import { Crypto } from "@peculiar/webcrypto";
import { ExpoRoot } from 'expo-router';

// https://docs.expo.dev/router/reference/troubleshooting/#expo_router_app_root-not-defined
Object.assign(global.crypto, new Crypto());
// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
