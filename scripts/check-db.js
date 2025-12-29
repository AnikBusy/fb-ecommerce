
import dbConnect from './lib/db.js';
import Category from './models/Category.js';
import Product from './models/Product.js';

async function checkData() {
    await dbConnect();
    const categories = await Category.find({}).lean();
    const products = await Product.find({}).lean();

    console.log("--- Categories ---");
    categories.forEach(c => console.log(`${c.name}: ${c.image}`));

    console.log("\n--- Products ---");
    products.forEach(p => console.log(`${p.title}: ${p.images}`));

    process.exit(0);
}

checkData();
