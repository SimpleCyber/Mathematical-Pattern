import { classicPatterns } from './classic.js';
import { gridPatterns } from './grids.js';
import { curvePatterns } from './curves.js';
import { spacePatterns } from './space.js';
import { complexPatterns } from './complex.js';
import { coolPatterns } from './cool.js';

export const patterns = {
    ...classicPatterns,
    ...gridPatterns,
    ...curvePatterns,
    ...spacePatterns,
    ...complexPatterns,
    ...coolPatterns
};
