export default {
    cloudy: { left: 'clouds', op: '>', right: 30 },
    sunny: { left: 'clouds', op: '<', right: 30 },
    windy: { left: 'wind', op: '>', right: 5 },
    dry: { left: 'humidity', op: '<', right: 50 },
    rainy: { left: 'rain', op: '>', right: 0 },
    snowy: { left: 'snow', op: '>', right: 0 },
};