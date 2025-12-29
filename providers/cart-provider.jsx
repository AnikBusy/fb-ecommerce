'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
    const [cart, setCart] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    // Hydrate cart from localStorage
    useEffect(() => {
        setIsMounted(true)
        try {
            const savedCart = localStorage.getItem('cart')
            if (savedCart) {
                const parsed = JSON.parse(savedCart)
                if (Array.isArray(parsed)) {
                    // Validate items have product
                    const validCart = parsed.filter(item => item.product && item.product._id)
                    setCart(validCart)
                }
            }
        } catch (error) {
            console.error("Failed to parse cart:", error)
            localStorage.removeItem('cart')
        }
    }, [])

    // Save cart to localStorage
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('cart', JSON.stringify(cart))
        }
    }, [cart, isMounted])

    const addToCart = (product, quantity = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.product._id === product._id)
            if (existing) {
                return prev.map(item =>
                    item.product._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            }
            return [...prev, { product, quantity }]
        })
        setIsOpen(true)
    }

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.product._id !== productId))
    }

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return
        setCart(prev => prev.map(item =>
            item.product._id === productId ? { ...item, quantity } : item
        ))
    }

    const clearCart = () => {
        setCart([])
    }

    const toggleCart = () => setIsOpen(prev => !prev)

    const cartTotal = cart.reduce((total, item) => {
        if (!item.product) return total
        return total + (item.product.discountPrice || item.product.price || 0) * item.quantity
    }, 0)

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            isOpen,
            toggleCart,
            setIsOpen,
            cartTotal
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext)
}
