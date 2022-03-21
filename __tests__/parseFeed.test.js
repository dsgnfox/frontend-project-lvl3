import { expect, test } from '@jest/globals';
import path from 'path';
import fs from 'fs/promises';
import parseFeed from '../src/scripts/parseFeed.js';

const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '__fixtures__', filename);

test('Broken feed', async () => {
  const filepath = getFixturePath('brokenFeed.xml');
  const feed = await fs.readFile(filepath, 'utf-8');

  expect.assertions(2);

  try {
    parseFeed(feed);
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
    expect(error).toHaveProperty('isParsingError', true);
  }
});
