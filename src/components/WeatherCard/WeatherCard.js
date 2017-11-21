import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import * as icons from './icons.json';
import './WeatherCard.css';

class WeatherCard extends Component {
    iconName() {
        const code = this.props.data.weather[0].id;
        var icon = icons[code].icon;
        if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
            icon = 'day-' + icon;
        }
        return 'wi wi-' + icon;
    }

    render() {
        const { className, data } = this.props;
        return (
            <Paper className={className}>
                <div className="WeatherCard-icon">
                    <i className={this.iconName()}></i>
                </div>
                <Typography type="headline" component="h1" align="center">
                    {data.name}
                </Typography>
                <ul className="WeatherIcon-metadata">
                    <li className="WeatherIcon-metadataItem">
                        <div className="WeatherIcon-metadataTitle">
                            <Typography type="caption">Temperature</Typography>
                        </div>
                        <div className="WeatherIcon-metadataValue">
                            <i className="wi wi-day-sunny"></i>
                            <span className="WeatherIcon-dayTemperature">{Math.round(data.main.temp_max)}</span>
                            <i className="wi wi-night-clear"></i>
                            <span className="WeatherIcon-nightTemperature">{Math.round(data.main.temp_min)}</span>
                        </div>
                    </li>
                    <li className="WeatherIcon-metadataItem">
                        <div className="WeatherIcon-metadataTitle">
                            <Typography type="caption">Humidity</Typography>
                        </div>
                        <div className="WeatherIcon-metadataValue">
                            <i className="wi wi-raindrop"></i>
                            <span className="WeatherIcon-humidity">{Math.round(data.main.humidity)}%</span>
                        </div>
                    </li>
                </ul>
            </Paper>
        )
    }
}

export default WeatherCard;