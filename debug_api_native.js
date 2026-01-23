
async function testApi() {
    try {
        console.log("Fetching http://localhost:5000/api/restaurants...");
        const res = await fetch("http://localhost:5000/api/restaurants");
        console.log("Status:", res.status);
        const data = await res.json();
        console.log("Data:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Fetch failed:", err);
    }
}

testApi();
