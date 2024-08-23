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

    if (isNaN(oktettIP1) || isNaN(oktettIP2) || isNaN(oktettIP3) || isNaN(oktettIP4)) {
        alert('Vui lòng nhập đầy đủ và chính xác các giá trị.');
        return;
    }

    // Xác định lớp IP
    let cimosztalyLabel = document.getElementById('cimosztalyLabel');
    if (oktettIP1 >= 1 && oktettIP1 <= 127) cimosztalyLabel.textContent = "Class A";
    else if (oktettIP1 >= 128 && oktettIP1 <= 191) cimosztalyLabel.textContent = "Class B";
    else if (oktettIP1 >= 192 && oktettIP1 <= 223) cimosztalyLabel.textContent = "Class C";
    else if (oktettIP1 >= 224 && oktettIP1 <= 239) cimosztalyLabel.textContent = "Class D";
    else if (oktettIP1 >= 240 && oktettIP1 <= 255) cimosztalyLabel.textContent = "Class E";

    // Địa chỉ IP dưới dạng nhị phân
    let binaryIP = [oktettIP1, oktettIP2, oktettIP3, oktettIP4].map(oktettToBinary).join('.');
    document.getElementById('binarisIPLabel').textContent = "Binary IP: " + binaryIP;

    // Xác định subnet mask
    let cidr = parseInt(document.getElementById('cidr').value);
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

// Xử lý sự kiện khi nhấn nút tính toán
document.getElementById('calculateBtn').addEventListener('click', () => {
    let oktett1 = document.getElementById('octet1').value;
    let oktett2 = document.getElementById('octet2').value;
    let oktett3 = document.getElementById('octet3').value;
    let oktett4 = document.getElementById('octet4').value;
    
    // Kiểm tra địa chỉ IP hợp lệ
    if (isValidIP(oktett1, oktett2, oktett3, oktett4)) {
        calculate();
    } else {
        alert("Địa chỉ IP không hợp lệ. Vui lòng nhập địa chỉ IP chính xác.");
    }
});

// Hàm kiểm tra địa chỉ IP hợp lệ
function isValidIP(o1, o2, o3, o4) {
    return isOktettValid(o1) && isOktettValid(o2) && isOktettValid(o3) && isOktettValid(o4);
}

// Hàm kiểm tra oktett hợp lệ
function isOktettValid(o) {
    let num = parseInt(o);
    return num >= 0 && num <= 255 && !isNaN(num);
}
