// Hàm chuyển đổi số nguyên oktett thành chuỗi nhị phân 8 bit
function oktettToBinary(oktett) {
    return oktett.toString(2).padStart(8, '0');
}

// Hàm chuyển đổi nhị phân thành số nguyên
function binaryToDecimal(binaryAddress) {
    return binaryAddress.split('.').map(octet => parseInt(octet, 2));
}

// Hàm tính toán thông tin địa chỉ IP và subnet mask
function calculate() {
    // Lấy giá trị từ các trường nhập liệu
    let oktettIP1 = parseInt(document.getElementById('octet1').value);
    let oktettIP2 = parseInt(document.getElementById('octet2').value);
    let oktettIP3 = parseInt(document.getElementById('octet3').value);
    let oktettIP4 = parseInt(document.getElementById('octet4').value);
    let cidr = parseInt(document.getElementById('cidr').value);

    if (isNaN(oktettIP1) || isNaN(oktettIP2) || isNaN(oktettIP3) || isNaN(oktettIP4) || isNaN(cidr)) {
        alert('Vui lòng nhập đầy đủ và chính xác các giá trị.');
        return;
    }

    // Địa chỉ IP dưới dạng nhị phân
    let binaryIP = [oktettIP1, oktettIP2, oktettIP3, oktettIP4].map(oktettToBinary).join('.');
    document.getElementById('binarisIPLabel').textContent = "Binary IP: " + binaryIP;

    // Xác định subnet mask
    let mask = calculateSubnetMask(cidr);
    document.getElementById('maszkLabel').textContent = "Subnet Mask: " + mask;

    // Subnet mask dưới dạng nhị phân
    let binaryMask = mask.split('.').map(octet => oktettToBinary(parseInt(octet))).join('.');
    document.getElementById('binarisMaszkLabel').textContent = "Binary Subnet Mask: " + binaryMask;

    // Xác định địa chỉ mạng
    let networkAddress = calculateNetworkAddress(oktettIP1, oktettIP2, oktettIP3, oktettIP4, mask);
    document.getElementById('halozatiCimLabel').textContent = "Network Address: " + networkAddress;

    // Xác định địa chỉ broadcast
    let broadcastAddress = calculateBroadcastAddress(networkAddress, mask);
    document.getElementById('broadcastLabel').textContent = "Broadcast Address: " + broadcastAddress;

    // Xác định phạm vi địa chỉ IP
    let ipRange = calculateIPRange(networkAddress, broadcastAddress, cidr);
    document.getElementById('ipCimtartomanyLabel').textContent = "IP Range: " + ipRange;

    // Xác định số lượng địa chỉ IP hợp lệ
    let ipCount = calculateValidIPCount(cidr);
    document.getElementById('ipCimekDbLabel').textContent = "Number of IPs: " + ipCount.toLocaleString() + " địa chỉ IP";

    // Tính toán và hiển thị tất cả các mạng con
    let subnetworks = calculateSubnets(oktettIP1, oktettIP2, oktettIP3, oktettIP4, cidr);
    let subnetResults = subnetworks.map((subnet, index) => {
        let network = subnet.network.join('.');
        let broadcast = subnet.broadcast.join('.');
        let rangeStart = subnet.rangeStart.join('.');
        let rangeEnd = subnet.rangeEnd.join('.');
        return `<li>Mạng con ${index + 1}: ${network}, Broadcast: ${broadcast}, Phạm vi: ${rangeStart} - ${rangeEnd}</li>`;
    }).join('');
    document.getElementById('subnetworksLabel').innerHTML = `<ul>${subnetResults}</ul>`;

    // Xác định lớp IP
    let cimosztalyLabel = document.getElementById('cimosztalyLabel');
    if (oktettIP1 >= 1 && oktettIP1 <= 127) cimosztalyLabel.textContent = "Class A";
    else if (oktettIP1 >= 128 && oktettIP1 <= 191) cimosztalyLabel.textContent = "Class B";
    else if (oktettIP1 >= 192 && oktettIP1 <= 223) cimosztalyLabel.textContent = "Class C";
    else if (oktettIP1 >= 224 && oktettIP1 <= 239) cimosztalyLabel.textContent = "Class D";
    else if (oktettIP1 >= 240 && oktettIP1 <= 255) cimosztalyLabel.textContent = "Class E";
}

// Hàm tính toán subnet mask
function calculateSubnetMask(cidr) {
    const mask = (0xFFFFFFFF << (32 - cidr)) >>> 0;
    return [
        (mask >>> 24) & 0xFF,
        (mask >>> 16) & 0xFF,
        (mask >>> 8) & 0xFF,
        mask & 0xFF
    ].join('.');
}

// Hàm tính toán địa chỉ mạng
function calculateNetworkAddress(ip1, ip2, ip3, ip4, mask) {
    let maskArr = mask.split('.').map(Number);
    return [
        ip1 & maskArr[0],
        ip2 & maskArr[1],
        ip3 & maskArr[2],
        ip4 & maskArr[3]
    ].join('.');
}

// Hàm tính toán địa chỉ broadcast
function calculateBroadcastAddress(networkAddress, mask) {
    let networkArr = networkAddress.split('.').map(Number);
    let maskArr = mask.split('.').map(Number);
    let invertedMask = maskArr.map(octet => 255 - octet);
    return [
        networkArr[0] | invertedMask[0],
        networkArr[1] | invertedMask[1],
        networkArr[2] | invertedMask[2],
        networkArr[3] | invertedMask[3]
    ].join('.');
}

// Hàm tính phạm vi địa chỉ IP
function calculateIPRange(networkAddress, broadcastAddress, cidr) {
    if (cidr === 31 || cidr === 32) return "―";
    let [startIP1, startIP2, startIP3, startIP4] = networkAddress.split('.').map(Number);
    startIP4 += 1;
    let [endIP1, endIP2, endIP3, endIP4] = broadcastAddress.split('.').map(Number);
    endIP4 -= 1;
    return `${startIP1}.${startIP2}.${startIP3}.${startIP4} - ${endIP1}.${endIP2}.${endIP3}.${endIP4}`;
}

// Hàm tính số lượng địa chỉ IP hợp lệ
function calculateValidIPCount(cidr) {
    return cidr === 31 || cidr === 32 ? 0 : Math.pow(2, 32 - cidr) - 2;
}

// Hàm tính toán tất cả các mạng con
function calculateSubnets(ip1, ip2, ip3, ip4, cidr) {
    let baseIP = (ip1 << 24) | (ip2 << 16) | (ip3 << 8) | ip4;
    let hostBits = 32 - cidr;
    let numberOfSubnets = Math.pow(2, cidr - 24);
    let subnetSize = Math.pow(2, hostBits);

    let subnets = [];

    for (let i = 0; i < numberOfSubnets; i++) {
        let subnetIP = baseIP + (i * subnetSize);
        let subnetStart = [
            (subnetIP >>> 24) & 0xFF,
            (subnetIP >>> 16) & 0xFF,
            (subnetIP >>> 8) & 0xFF,
            subnetIP & 0xFF
        ];

        let subnetEndIP = subnetIP + subnetSize - 1;
        let broadcastIP = [
            (subnetEndIP >>> 24) & 0xFF,
            (subnetEndIP >>> 16) & 0xFF,
            (subnetEndIP >>> 8) & 0xFF,
            subnetEndIP & 0xFF
        ];

        let rangeStart = [...subnetStart];
        rangeStart[3] += 1;
        let rangeEnd = [...broadcastIP];
        rangeEnd[3] -= 1;

        subnets.push({
            network: subnetStart,
            broadcast: broadcastIP,
            rangeStart: rangeStart,
            rangeEnd: rangeEnd
        });
    }

    return subnets;
}

// Cập nhật hàm xử lý sự kiện khi nhấn nút tính toán
document.getElementById('calculateBtn').addEventListener('click', () => {
    let oktett1 = document.getElementById('octet1').value;
    let oktett2 = document.getElementById('octet2').value;
    let oktett3 = document.getElementById('octet3').value;
    let oktett4 = document.getElementById('octet4').value;
    let cidr = document.getElementById('cidr').value;
    
    if (oktett1 && oktett2 && oktett3 && oktett4 && cidr) {
        calculate();
    } else {
        alert("Vui lòng nhập đầy đủ các giá trị.");
    }
});
