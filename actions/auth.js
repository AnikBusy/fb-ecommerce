'use server'

import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key-change-this";
const key = new TextEncoder().encode(SECRET_KEY);

export async function login(formData) {
    const username = formData.get("username");
    const password = formData.get("password");

    if (!username || !password) {
        return { success: false, error: "Missing fields" };
    }

    await dbConnect();

    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return { success: false, error: "Invalid credentials" };
        }

        const isValid = await bcrypt.compare(password, admin.password);
        if (!isValid) {
            return { success: false, error: "Invalid credentials" };
        }

        // Create Session
        const jwt = await new SignJWT({ id: admin._id.toString(), username: admin.username })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(key);

        (await cookies()).set("admin_token", jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
        });

    } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: "Something went wrong" };
    }

    redirect("/admin/dashboard");
}

export async function logout() {
    (await cookies()).delete("admin_token");
    redirect("/admin/login");
}

export async function getCurrentAdmin() {
    const token = (await cookies()).get("admin_token")?.value;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, key);
        if (!payload || !payload.id) return null;

        // Fail gracefully if ID is not a string (prevents CastError for old sessions)
        if (typeof payload.id !== 'string') return null;

        await dbConnect();
        const admin = await Admin.findById(payload.id).select("-password").lean();
        return JSON.parse(JSON.stringify(admin));
    } catch (e) {
        console.error("GetCurrentAdmin error:", e);
        return null;
    }
}

export async function getSession() {
    const token = (await cookies()).get("admin_token")?.value;
    if (!token) return null;
    try {
        // Verification happens in middleware usually, but we can verify here too if needed
        return true;
    } catch (e) {
        return null;
    }
}

export async function getAdmins() {
    await dbConnect();
    const admins = await Admin.find({}).select('-password').sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(admins));
}

export async function createAdmin(username, password, profileData = {}) {
    try {
        await dbConnect();
        const existing = await Admin.findOne({ username });
        if (existing) {
            return { success: false, error: "Username already exists" };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        await Admin.create({
            username,
            password: hashedPassword,
            image: profileData.image || '',
            email: profileData.email || '',
            phone: profileData.phone || '',
            nid: profileData.nid || ''
        });
        revalidatePath('/admin/admins');
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function deleteAdmin(id) {
    try {
        await dbConnect();
        // Prevent deleting the last admin
        const count = await Admin.countDocuments();
        if (count <= 1) {
            return { success: false, error: "Cannot delete the last admin" };
        }

        await Admin.findByIdAndDelete(id);
        revalidatePath('/admin/admins');
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function updateAdmin(id, data) {
    try {
        await dbConnect();

        const updateData = { ...data };

        // Handle password update if provided
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        } else {
            delete updateData.password;
        }

        await Admin.findByIdAndUpdate(id, updateData);
        revalidatePath('/admin/admins');
        return { success: true };
    } catch (error) {
        console.error("Update admin error:", error);
        return { success: false, error: error.message };
    }
}
