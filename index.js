import { registerRootComponent } from 'expo';
import "./polyfill";
import { Crypto } from "@peculiar/webcrypto";
import { ExpoRoot } from 'expo-router';

Object.assign(global.crypto, new Crypto());
export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
