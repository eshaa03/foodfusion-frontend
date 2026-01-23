import mongoose from 'mongoose';
import Restaurant from '../backend/models/Restaurant.js';
import User from '../backend/models/User.js';

const run = async () => {
    try {
        console.log("Connecting to DB from frontend script...");
        await mongoose.connect("mongodb://127.0.0.1:27019/foodfusion");
        console.log("Connected.");

        const count = await Restaurant.countDocuments();
        console.log(`Restaurant Count: ${count}`);

        if (count > 0) {
            const one = await Restaurant.findOne();
            console.log("Sample Restaurant:", JSON.stringify(one, null, 2));
        } else {
            console.log("No restaurants found in DB.");
        }

    } catch (error) {
        console.error("DB Error:", error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
