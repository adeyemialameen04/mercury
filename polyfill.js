import { Buffer } from "buffer/";
import process from "process";
import "react-native-get-random-values";
import { TextDecoder, TextEncoder } from "text-encoding";

global.process = process;
global.Buffer = Buffer;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
