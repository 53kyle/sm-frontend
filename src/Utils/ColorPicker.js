const pastels = [
    "rgba(253, 223, 223, 1.0)",
    "rgba(252, 247, 222, 1)",
    "rgba(222, 253, 222, 1.0)",
    "rgba(222, 243, 253, 1.0)",
    "rgba(255, 240, 253, 1.0)",
    "rgba(255, 179, 186, 1.0)",
    "rgba(255, 223, 186, 1.0)",
    "rgba(255, 255, 186, 1.0)",
    "rgba(186, 255, 201, 1.0)",
    "rgba(186, 255, 255, 1.0)",
    "rgba(168, 230, 207, 1.0)",
    "rgba(220, 237, 193, 1.0)",
    "rgba(255, 211, 182, 1.0)",
    "rgba(255, 170, 165, 1.0)",
    "rgba(255, 139, 148, 1.0)",
    "rgba(255, 312, 229, 1.0)",
    "rgba(212, 255, 234, 1.0)",
    "rgba(238, 203, 255, 1.0)",
    "rgba(254, 255, 163, 1.0)",
    "rgba(219, 220, 255, 1.0)",
]

function GetPastelFromString(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return pastels[Math.abs(hash) % 20]
}

export default GetPastelFromString;