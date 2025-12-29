
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI not found');
    process.exit(1);
}

const CategorySchema = new mongoose.Schema({
    name: String,
    image: String
});

const ProductSchema = new mongoose.Schema({
    title: String,
    images: [String]
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function check() {
    await mongoose.connect(MONGODB_URI);
    const cats = await Category.find({});
    const prods = await Product.find({});

    console.log('--- CATEGORIES ---');
    console.log(JSON.stringify(cats.map(c => ({ name: c.name, image: c.image })), null, 2));

    console.log('\n--- PRODUCTS ---');
    console.log(JSON.stringify(prods.map(p => ({ title: p.title, images: p.images })), null, 2));

    process.exit(0);
}

check().catch(err => {
    console.error(err);
    process.exit(1);
});
