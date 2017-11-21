const logical = /((AND|OR|NOT)\b|(?!$))/gi;
const numberRE = /((0|[1-9]\d*)(\.\d+)?|(?!$))/gi;
const nameRE = /([a-z]+|(?!$))/gi;
const operators = ['<', '>'];
const whitespace = ' \r\t\n\v\u00A0'.split('');

export function tokenize(text) {
    const tokens = [];
    let index = 0;
    while (index < text.length) {
        const ch = text.charAt(index);
        if (whitespace.indexOf(ch) !== -1) {
            index++;
        } else if (operators.indexOf(ch) !== -1) {
            tokens.push({ type: 'OP', value: ch, offset: index, length: 1 });
            index++;
        } else if (ch === "(") {
            tokens.push({ type: "LPAREN", offset: index, length: 1 });
            index++;
        } else if (ch === ")") {
            tokens.push({ type: "RPAREN", offset: index, length: 1 });
            index++;
        } else {
            logical.lastIndex = index;
            let match = logical.exec(text);
            if (match && match[0].length > 0) {
                tokens.push({ type: "OP", value: match[0].toUpperCase(), offset: index, length: match[0].length });
                index += match[0].length;
                continue;
            }
            numberRE.lastIndex = index;
            match = numberRE.exec(text);
            if (match && match[0].length > 0) {
                tokens.push({ type: "NUMBER", value: parseFloat(match[0]), offset: index, length: match[0].length });
                index += match[0].length;
                continue;
            }
            nameRE.lastIndex = index;
            match = nameRE.exec(text);
            if (match && match[0].length > 0) {
                tokens.push({ type: "IDENTIFIER", value: match[0], offset: index, length: match[0].length });
                index += match[0].length;
                continue;
            }
            throw new Error(`Invalid character '${ch}' at ${index}`);
        }
    }
    tokens.push({ type: "EOL", offset: index, length: 0 });
    return tokens;
}