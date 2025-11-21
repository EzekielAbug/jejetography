// src/jejetography.js

// 1. YOUR EXACT CUSTOM MAP
export const cipherMap = {
  "A": "4",   "N": "()",
  "B": "ß",   "O": "0",
  "C": "₵",   "P": "₱",
  "D": ")",   "Q": "9~",
  "E": "3",   "R": "Я",
  "F": "ƒ",   "S": "5",
  "G": "6",   "T": "7",
  "H": "[-]", "U": "Ü",
  "I": "1",   "V": "√",
  "J": "_/",  "W": "^/",
  "K": "<",   "X": "×",
  "L": "£",   "Y": "¥",
  "M": "^^",  "Z": "2"
};

const vowels = ["A", "E", "I", "O", "U"];
const prefixes = ["(C)", "<V>"];
const suffix = "#L";
const vowelMarker = "~";

// --- HELPER: Build a list of ALL valid tokens (Symbols + Tags) ---
// We need this for the Decryptor to know what a "symbol" is.
// We sort by length (descending) so we match longest symbols first (e.g. '[-]' before '-')
const validTokens = [
  suffix, ...prefixes, vowelMarker,
  ...Object.values(cipherMap)
].sort((a, b) => b.length - a.length);

// Reverse Map for Decryption
const reverseMap = {};
Object.entries(cipherMap).forEach(([k, v]) => reverseMap[v] = k);


// 2. ENCRYPTION FUNCTION (Updated for Atomic Reversal)
export function encryptText(inputText) {
  if (!inputText) return "";

  return inputText.split(" ").map(word => {
    const cleanWord = word.toUpperCase().replace(/[^A-Z]/g, "");
    if (cleanWord.length === 0) return word;

    // Step 1: Build an ARRAY of parts (Tokens), not a string
    let parts = [];

    // Prefix
    const isVowelStart = vowels.includes(cleanWord[0]);
    parts.push(isVowelStart ? "<V>" : "(C)");

    // Body Substitution
    for (let char of cleanWord) {
      parts.push(cipherMap[char] || char); // Add symbol as a single unit
      if (vowels.includes(char)) {
        parts.push(vowelMarker); // Add marker as a single unit
      }
    }

    // Length Tag
    if (cleanWord.length >= 5) parts.push("#L");

    // Step 2: Reverse the ARRAY
    // This reverses the ORDER but keeps the SYMBOLS intact.
    // Ex: ["(C)", "()", "0", "~"] -> ["~", "0", "()", "(C)"]
    // Result String: "~0()(C)" (Notice N is still () and not )()
    return parts.reverse().join("");
  }).join(" ");
}


// 3. DECRYPTION FUNCTION (Updated for Token Parsing)
export function decryptText(encryptedText) {
  if (!encryptedText) return "";

  return encryptedText.split(" ").map(word => {
    if (!word) return "";
    
    // Step 1: Tokenize the string
    // We must break the string "~0()(C)" back into ["~", "0", "()", "(C)"]
    let tokens = [];
    let remaining = word;
    
    while (remaining.length > 0) {
      // Find the matching token (Greedy match longest first)
      let match = validTokens.find(t => remaining.startsWith(t));
      
      if (match) {
        tokens.push(match);
        remaining = remaining.slice(match.length);
      } else {
        // Fallback for unknown chars (just take 1 char)
        tokens.push(remaining[0]);
        remaining = remaining.slice(1);
      }
    }

    // Step 2: Reverse Tokens back to Forward Order
    // ["~", "0", "()", "(C)"] -> ["(C)", "()", "0", "~"]
    let forwardParts = tokens.reverse();

    // Step 3: Remove Tags
    // Remove Prefix (First item)
    if (prefixes.includes(forwardParts[0])) {
      forwardParts.shift();
    }
    // Remove Suffix (Last item)
    if (forwardParts[forwardParts.length - 1] === suffix) {
      forwardParts.pop();
    }

    // Step 4: Decode Body
    let result = "";
    for (let part of forwardParts) {
      // Skip Vowel Marker (We don't need it to know the letter)
      if (part === vowelMarker) continue;

      // Map back to letter
      result += reverseMap[part] || part;
    }

    return result;
  }).join(" ");
}