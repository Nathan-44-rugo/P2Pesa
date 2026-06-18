import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
// @ts-expect-error - TS doesn't like assigning TextDecoder to global
global.TextDecoder = TextDecoder;
