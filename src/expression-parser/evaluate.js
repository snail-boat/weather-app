function getValue(prop, data) {
    switch (prop) {
        case "temp":
            return Math.round(data.main.temp_max);
        case "wind":
            return data.wind.speed;
        case "rain":
            return data.rain ? data.rain['3h'] : 0;
        case "snowy":
            return data.snow ? data.snow['3h'] : 0;
        case "clouds":
            return data.clouds.today
        case "humidity":
            return data.main.humidity
        default:
            throw new Error(`Invalid property name "${prop}"`)
    }
}

function evalPredicate(left, op, right) {
    switch (op) {
        case ">":
            return left > right;
        case "<":
            return left < right;
    }
}

export function evaluate(expr, shortcuts, data) {
    switch (expr.type) {
        case "BINARY":
            switch (expr.operator) {
                case "AND":
                    return evaluate(expr.left, shortcuts, data) && evaluate(expr.right, shortcuts, data);
                case "OR":
                    return evaluate(expr.left, shortcuts, data) || evaluate(expr.right, shortcuts, data);
                default:
                    throw new Error(`Invalid binary operator "${expr.operator}"`)
            }
        case "UNNARY":
            return !evaluate(expr.expression, shortcuts, data);
        case "PREDICATE":
            const left = getValue(expr.left.value, data);
            return evalPredicate(left, expr.op, expr.right.value);
        case "SHORTCUT": {
            const shortcut = shortcuts[expr.name.value.toLowerCase()];
            if (!shortcut) {
                throw new Error(`Invalid shortcut name "${expr.name.value}"`)
            }
            const left = getValue(shortcut.left, data);
            return evalPredicate(left, shortcut.op, shortcut.right);
        }
        default:
            throw new Error(`Invalid expression type "${expr.type}"`)
    }
}