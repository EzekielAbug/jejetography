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

// --- HELPER: Create Reverse Map for Decryption ---
const reverseMap = {};
Object.entries(cipherMap).forEach(([key, value]) => {
  reverseMap[value] = key;
});
// Sort symbols by length (descending) to match multi-char symbols (like '[-]') first
const sortedSymbols = Object.keys(reverseMap).sort((a, b) => b.length - a.length);


// 2. ENCRYPTION FUNCTION
export function encryptText(inputText) {
  if (!inputText) return "";

  return inputText.split(" ").map(word => {
    const cleanWord = word.toUpperCase().replace(/[^A-Z]/g, "");
    if (cleanWord.length === 0) return word;

    // Rule 1: Prefix
    const firstChar = cleanWord[0];
    const isVowelStart = vowels.includes(firstChar);
    const prefix = isVowelStart ? "<V>" : "(C)";

    // Rule 2: Substitution + Vowel Markers
    let transformedBody = "";
    for (let char of cleanWord) {
      const mappedChar = cipherMap[char] || char;
      transformedBody += mappedChar;
      if (vowels.includes(char)) {
        transformedBody += "~";
      }
    }

    // Rule 3: Length Tag
    const lengthTag = cleanWord.length >= 5 ? "#L" : "";

    // Rule 4: Assemble & Reverse
    const fullString = prefix + transformedBody + lengthTag;
    return fullString.split("").reverse().join("");
  }).join(" ");
}


// 3. DECRYPTION FUNCTION (NEW!)
export function decryptText(encryptedText) {
  if (!encryptedText) return "";

  return encryptedText.split(" ").map(word => {
    if (!word) return "";

    // Step 1: Reverse back to normal order
    // e.g. "L#~0££~3[-](C)" -> "(C)[-]3~££0~#L"
    let processed = word.split("").reverse().join("");

    // Step 2: Remove Length Tag (#L) if present
    if (processed.endsWith("#L")) {
      processed = processed.slice(0, -2);
    }

    // Step 3: Remove Prefix ((C) or <V>)
    if (processed.startsWith("(C)")) {
      processed = processed.slice(3);
    } else if (processed.startsWith("<V>")) {
      processed = processed.slice(3);
    }

    // Step 4: Decode Symbols
    let result = "";
    let i = 0;
    while (i < processed.length) {
      let matchFound = false;

      // Try to match the longest symbols first (e.g. '[-]' before '[')
      for (const symbol of sortedSymbols) {
        if (processed.startsWith(symbol, i)) {
          result += reverseMap[symbol]; // Convert symbol back to letter
          i += symbol.length;
          matchFound = true;

          // Skip the Vowel Marker (~) if it exists immediately after
          if (processed[i] === "~") {
            i++; 
          }
          break;
        }
      }

      // If no symbol matched (e.g. spaces or unknown chars), just keep it
      if (!matchFound) {
        result += processed[i];
        i++;
      }
    }
    return result;
  }).join(" ");
}