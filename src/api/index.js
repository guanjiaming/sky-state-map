const OPEN_SKY_BASE_API = 'https://opensky-network.org/api';

export async function fetchFlightData() {
    try {
        // 发送API请求
        const response = await fetch(OPEN_SKY_BASE_API + '/states/all?lamin=3.51&lomin=73.40&lamax=53.33&lomax=135.05');

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

export async function fetchFlightState(icao24) {
    try {
        // 发送API请求
        const response = await fetch(OPEN_SKY_BASE_API + '/states/all?icao24=' + icao24);

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
    const lon = state[5] !== null ? state[5] : 'N/A';
    const lat = state[6] !== null ? state[6]: 'N/A';
    const altitude = state[7] !== null ? state[7] : 0; // 转换为英尺
    const velocity = state[9] !== null ? state[9] : 0; // 转换为m/s
    const heading = state[10] !== null ? state[10] : 0;
    const timePosition = state[4] * 1000 || 0;
    return {
        icao24,
        callsign,
        originCountry,
        lon,
        lat,
        altitude,
        velocity,
        heading,
        timePosition
    }
}