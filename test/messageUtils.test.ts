import { isMessagePalindrome } from '../src/messageUtils';

describe('message utils', () => {
    describe('isMessagePalindrome', () => {
        it('should return false if the string is not a palindrome', () => {
            const testString = 'Hi Alice!';
            const palindrome = isMessagePalindrome(testString);
            expect(palindrome).toBeFalsy();
        });

        it('should return true if the string is a palindrome', () => {
            const palindromeArray = ['a', 'bbb', '02/02/2020', 'A man, a plan, a canal – Panama', 'saippuakivikauppias'];
            const checkArray = palindromeArray.map((string) => isMessagePalindrome(string));
            for (const pal of checkArray) {
                expect(pal).toBeTruthy();
            }
        });
    });
});
