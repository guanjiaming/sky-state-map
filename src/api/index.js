const OPEN_SKY_API = 'https://opensky-network.org/api/states/all';

export async function fetchFlightData() {
    try {
        // 发送API请求
        const response = await fetch(OPEN_SKY_API);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const states = data.states.map(formatState);
        console.log(states);
        return states;
    } catch (error) {
        throw new Error(`获取数据失败: ${error.message}`);
    }
}

function formatState(state) {
    const icao24 = state[0] || 'N/A';
    const callsign = (state[1]).trim();
    const originCountry = state[2] || 'N/A';
    const lon = state[5] !== null ? state[5].toFixed(4) : 'N/A';
    const lat = state[6] !== null ? state[6].toFixed(4) : 'N/A';
    const altitude = state[7] !== null ? `${(state[7] * 3.28084).toFixed(0)} ft` : 'N/A'; // 转换为英尺
    const velocity = state[9] !== null ? `${(state[9] * 3.6).toFixed(0)} km/h` : 'N/A'; // 转换为km/h
    const heading = state[10] !== null ? state[10].toFixed(1) : 'N/A';
    const lastContact = state[4] ? new Date(state[4] * 1000).toLocaleString() : 'N/A';
    return {
        icao24,
        callsign,
        originCountry,
        lon,
        lat,
        altitude,
        velocity,
        heading,
        lastContact,
    }
}