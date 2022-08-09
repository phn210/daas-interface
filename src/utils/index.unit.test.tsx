import { buildPathToPublicResource } from '.';

describe('test utils', () => {
  describe('test buildPathToPublicResource function', () => {
    test('should return correct path to the resource', () => {
      const publicUrl = process.env.PUBLIC_URL;
      expect(buildPathToPublicResource('favicon.ico')).toBe(`${publicUrl}/favicon.ico`);
      expect(buildPathToPublicResource('/favicon.ico')).toBe(`${publicUrl}/favicon.ico`);
      expect(buildPathToPublicResource('/')).toBe(`${publicUrl}/`);
      expect(buildPathToPublicResource('')).toBe(`${publicUrl}/`);
    });
  });
});
