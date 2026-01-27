async function testApi() {
    try {
        console.log("Fetching backend...");
        const res = await fetch("https://foodfusion-backend-zjrp.onrender.com/api/restaurants");
        console.log("Status:", res.status);
        const data = await res.json();
        console.log("Data:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Fetch failed:", err);
    }
}

testApi();
