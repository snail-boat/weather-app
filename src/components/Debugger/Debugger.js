import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import './Debugger.css';
import { tokenize, parse } from '../../expression-parser';

class Debugger extends Component {
    tokenId(token) {
        return `${token.type}:${token.value}:${token.offset}${token.length}`;
    }

    render() {
        const { text } = this.props;
        let tokens;
        let expression;
        let error;
        try {
            tokens = tokenize(text);
            expression = parse(text);
        } catch (e) {
            error = e.message;
        }
        return (
            <div>
                <Paper className="Debugger-card">
                    <Typography type="headline" component="h2">Tokens</Typography>
                    <div className="Debugger-tokens">
                        {tokens.map(t => (
                            <Chip key={this.tokenId(t)} className="Debugger-token" label={<span><b>{t.type}</b> {t.value}</span>} />))}
                    </div>
                </Paper>
                <Paper className="Debugger-card">
                    <Typography type="headline" component="h2">Expression</Typography>
                    <pre>
                        {JSON.stringify(expression, null, '  ')}
                    </pre>
                </Paper>
                <Paper className="Debugger-card">
                    <Typography type="headline" component="h2">Error</Typography>
                    {error}
                </Paper>
            </div>
        )
    }
}

export default Debugger;