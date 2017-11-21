import { tokenize } from './tokenize';

export function parse(text) {
    const tokens = tokenize(text);
    const parser = new Parser();
    return parser.parse(tokens);
}

class Parser {
    parse(tokens) {
        this.i = 0;
        this.tokens = tokens;
        const expression = this.expression();
        this.consume("EOL");
        return expression;
    }

    expression() {
        return this.logicalOr();
    }

    _binary(operators, next) {
        let left = next.apply(this);
        let token;
        while (token = this.expect("OP", ...operators)) {
            left = { type: "BINARY", operator: token.value, left, right: next.apply(this) };
        }
        return left;
    }

    logicalOr() {
        return this._binary(["OR"], this.logicalAnd);
    }

    logicalAnd() {
        return this._binary(["AND"], this.unnary);
    }

    unnary() {
        const token = this.expect("OP", "NOT");
        if (token) {
            return { type: "UNNARY", operator: token.value, expression: this.predicate() };
        } else {
            return this.predicate();
        }
    }

    predicate() {
        let token;
        if (this.expect("LPAREN")) {
            const expresssion = this.expression();
            this.consume("RPAREN");
            return expresssion;
        } else if (token = this.expect("IDENTIFIER")) {
            let op;
            if (op = this.expect("OP", "<", ">")) {
                const right = this.consume("NUMBER");
                return { type: "PREDICATE", left: token, right, op: op.value };
            } else {
                return { type: "SHORTCUT", name: token }
            }
        } else {
            const current = this.tokens[this.i];
            throw new Error(`Unexpected '${current.type}' at ${current.offset}`);
        }
    }

    peek(type, ...values) {
        const curr = this.tokens[this.i];
        if (curr.type === type && (values.length === 0 || values.some(v => curr.value === v))) {
            return curr;
        }
        return null;
    }

    consume(type, ...values) {
        const token = this.peek(type, ...values);
        if (!token) {
            const current = this.tokens[this.i];
            throw new Error(`Unexpected '${current.type}' at ${current.offset}, expected ${type}`);
        }
        this.i++;
        return token;
    }

    expect(type, ...values) {
        const token = this.peek(type, ...values);
        if (token) {
            this.i++;
        }
        return token;
    }
}