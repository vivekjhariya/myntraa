export const cartSubtotal = items => items.reduce((total, item) => total + item.price * item.qty, 0)
